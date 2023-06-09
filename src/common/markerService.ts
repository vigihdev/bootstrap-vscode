/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from 'vscode';
import { isFalsyOrEmpty, isNonEmptyArray } from './arrays';
import { Emitter, Event } from './event';
import { Iterable } from './iterator';
import { IDisposable } from './lifecycle';
import { ResourceMap } from './map';
import { IMarker, IMarkerData, IMarkerService, IResourceMarker, MarkerSeverity, MarkerStatistics } from './markers';
import { Schemas } from './network';

class DoubleResourceMap<V>{

	private _byResource = new ResourceMap<Map<string, V>>();
	private _byOwner = new Map<string, ResourceMap<V>>();

	set(resource: vscode.Uri, owner: string, value: V) {
		let ownerMap = this._byResource.get(resource);
		if (!ownerMap) {
			ownerMap = new Map();
			this._byResource.set(resource, ownerMap);
		}
		ownerMap.set(owner, value);

		let resourceMap = this._byOwner.get(owner);
		if (!resourceMap) {
			resourceMap = new ResourceMap();
			this._byOwner.set(owner, resourceMap);
		}
		resourceMap.set(resource, value);
	}

	get(resource: vscode.Uri, owner: string): V | undefined {
		const ownerMap = this._byResource.get(resource);
		return ownerMap?.get(owner);
	}

	delete(resource: vscode.Uri, owner: string): boolean {
		let removedA = false;
		let removedB = false;
		const ownerMap = this._byResource.get(resource);
		if (ownerMap) {
			removedA = ownerMap.delete(owner);
		}
		const resourceMap = this._byOwner.get(owner);
		if (resourceMap) {
			removedB = resourceMap.delete(resource);
		}
		if (removedA !== removedB) {
			throw new Error('illegal state');
		}
		return removedA && removedB;
	}

	values(key?: vscode.Uri | string): Iterable<V> {
		if (typeof key === 'string') {
			return this._byOwner.get(key)?.values() ?? Iterable.empty();
		}
		if (key instanceof vscode.Uri) {
			return this._byResource.get(key)?.values() ?? Iterable.empty();
		}

		return Iterable.map(Iterable.concat(...this._byOwner.values()), map => map[1]);
	}
}

class MarkerStats implements MarkerStatistics {

	errors = 0;
	infos = 0;
	warnings = 0;
	unknowns = 0;

	private readonly _data = new ResourceMap<MarkerStatistics>();
	private readonly _service: IMarkerService;
	private readonly _subscription: IDisposable;

	constructor(service: IMarkerService) {
		this._service = service;
		this._subscription = service.onMarkerChanged(this._update, this);
	}

	dispose(): void {
		this._subscription.dispose();
	}

	private _update(resources: readonly vscode.Uri[]): void {
		for (const resource of resources) {
			const oldStats = this._data.get(resource);
			if (oldStats) {
				this._substract(oldStats);
			}
			const newStats = this._resourceStats(resource);
			this._add(newStats);
			this._data.set(resource, newStats);
		}
	}

	private _resourceStats(resource: vscode.Uri): MarkerStatistics {
		const result: MarkerStatistics = { errors: 0, warnings: 0, infos: 0, unknowns: 0 };

		// TODO this is a hack
		if (resource.scheme === Schemas.inMemory || resource.scheme === Schemas.walkThrough || resource.scheme === Schemas.walkThroughSnippet) {
			return result;
		}

		for (const { severity } of this._service.read({ resource })) {
			if (severity === MarkerSeverity.Error) {
				result.errors += 1;
			} else if (severity === MarkerSeverity.Warning) {
				result.warnings += 1;
			} else if (severity === MarkerSeverity.Info) {
				result.infos += 1;
			} else {
				result.unknowns += 1;
			}
		}

		return result;
	}

	private _substract(op: MarkerStatistics) {
		this.errors -= op.errors;
		this.warnings -= op.warnings;
		this.infos -= op.infos;
		this.unknowns -= op.unknowns;
	}

	private _add(op: MarkerStatistics) {
		this.errors += op.errors;
		this.warnings += op.warnings;
		this.infos += op.infos;
		this.unknowns += op.unknowns;
	}
}

export class MarkerService implements IMarkerService {

	declare readonly _serviceBrand: undefined;

	private readonly _onMarkerChanged = new Emitter<readonly vscode.Uri[]>();
	readonly onMarkerChanged: Event<readonly vscode.Uri[]> = Event.debounce(this._onMarkerChanged.event, MarkerService._debouncer, 0);

	private readonly _data = new DoubleResourceMap<IMarker[]>();
	private readonly _stats: MarkerStats;

	constructor() {
		this._stats = new MarkerStats(this);
	}

	dispose(): void {
		this._stats.dispose();
	}

	getStatistics(): MarkerStatistics {
		return this._stats;
	}

	remove(owner: string, resources: vscode.Uri[]): void {
		for (const resource of resources || []) {
			this.changeOne(owner, resource, []);
		}
	}

	changeOne(owner: string, resource: vscode.Uri, markerData: IMarkerData[]): void {

		if (isFalsyOrEmpty(markerData)) {
			// remove marker for this (owner,resource)-tuple
			const removed = this._data.delete(resource, owner);
			if (removed) {
				this._onMarkerChanged.fire([resource]);
			}

		} else {
			// insert marker for this (owner,resource)-tuple
			const markers: IMarker[] = [];
			for (const data of markerData) {
				const marker = MarkerService._toMarker(owner, resource, data);
				if (marker) {
					markers.push(marker);
				}
			}
			this._data.set(resource, owner, markers);
			this._onMarkerChanged.fire([resource]);
		}
	}

	private static _toMarker(owner: string, resource: vscode.Uri, data: IMarkerData): IMarker | undefined {
		let {
			code, severity,
			message, source,
			startLineNumber, startColumn, endLineNumber, endColumn,
			relatedInformation,
			tags,
		} = data;

		if (!message) {
			return undefined;
		}

		// santize data
		startLineNumber = startLineNumber > 0 ? startLineNumber : 1;
		startColumn = startColumn > 0 ? startColumn : 1;
		endLineNumber = endLineNumber >= startLineNumber ? endLineNumber : startLineNumber;
		endColumn = endColumn > 0 ? endColumn : startColumn;

		return {
			resource,
			owner,
			code,
			severity,
			message,
			source,
			startLineNumber,
			startColumn,
			endLineNumber,
			endColumn,
			relatedInformation,
			tags,
		};
	}

	changeAll(owner: string, data: IResourceMarker[]): void {
		const changes: vscode.Uri[] = [];

		// remove old marker
		const existing = this._data.values(owner);
		if (existing) {
			for (const data of existing) {
				const first = Iterable.first(data);
				if (first) {
					changes.push(first.resource);
					this._data.delete(first.resource, owner);
				}
			}
		}

		// add new markers
		if (isNonEmptyArray(data)) {

			// group by resource
			const groups = new ResourceMap<IMarker[]>();
			for (const { resource, marker: markerData } of data) {
				const marker = MarkerService._toMarker(owner, resource, markerData);
				if (!marker) {
					// filter bad markers
					continue;
				}
				const array = groups.get(resource);
				if (!array) {
					groups.set(resource, [marker]);
					changes.push(resource);
				} else {
					array.push(marker);
				}
			}

			// insert all
			for (const [resource, value] of groups) {
				this._data.set(resource, owner, value);
			}
		}

		if (changes.length > 0) {
			this._onMarkerChanged.fire(changes);
		}
	}

	read(filter: { owner?: string; resource?: vscode.Uri; severities?: number, take?: number; } = Object.create(null)): IMarker[] {

		let { owner, resource, severities, take } = filter;

		if (!take || take < 0) {
			take = -1;
		}

		if (owner && resource) {
			// exactly one owner AND resource
			const data = this._data.get(resource, owner);
			if (!data) {
				return [];
			} else {
				const result: IMarker[] = [];
				for (const marker of data) {
					if (MarkerService._accept(marker, severities)) {
						const newLen = result.push(marker);
						if (take > 0 && newLen === take) {
							break;
						}
					}
				}
				return result;
			}

		} else if (!owner && !resource) {
			// all
			const result: IMarker[] = [];
			for (const markers of this._data.values()) {
				for (const data of markers) {
					if (MarkerService._accept(data, severities)) {
						const newLen = result.push(data);
						if (take > 0 && newLen === take) {
							return result;
						}
					}
				}
			}
			return result;

		} else {
			// of one resource OR owner
			const iterable = this._data.values(resource ?? owner!);
			const result: IMarker[] = [];
			for (const markers of iterable) {
				for (const data of markers) {
					if (MarkerService._accept(data, severities)) {
						const newLen = result.push(data);
						if (take > 0 && newLen === take) {
							return result;
						}
					}
				}
			}
			return result;
		}
	}

	private static _accept(marker: IMarker, severities?: number): boolean {
		return severities === undefined || (severities & marker.severity) === marker.severity;
	}

	// --- event debounce logic

	private static _dedupeMap: ResourceMap<true>;

	private static _debouncer(last: vscode.Uri[] | undefined, event: readonly vscode.Uri[]): vscode.Uri[] {
		if (!last) {
			MarkerService._dedupeMap = new ResourceMap();
			last = [];
		}
		for (const uri of event) {
			if (!MarkerService._dedupeMap.has(uri)) {
				MarkerService._dedupeMap.set(uri, true);
				last.push(uri);
			}
		}
		return last;
	}
}