
import { CompletionItem, CompletionItemKind, MarkdownString, Position, SnippetString, TextDocument } from 'vscode';
import { COMMAND_EMMET_CSS_PROPERTY_SELECTED, FILE_EMMET_CSS, TAG, kind } from '../constant';
import { DocumentHelper } from './documentHelper';
import { readFileJson } from './fsApi';
import path = require('path');
import { ContextExt } from './contextExt';

export interface IEmmetCss {
	key: string;
	property: string;
	value?: string;
}


const emmetCss = (): IEmmetCss[] => {
	const file = readFileJson<object>(ContextExt.getVendorDB() + path.sep + FILE_EMMET_CSS);
	const result: IEmmetCss[] = [];
	if (file) {
		Object.keys(file).forEach(key => {
			const value: string = file[key];
			if (!/@/g.test(value)) {
				const values = value.split(':');
				result.push({
					key: key,
					property: values[0],
					value: values.length >= 2 ?
						value.replace(values[0] + ':', '')
						: undefined,
				});
			}
		});
	}
	return result;
}

export const parseSnippet = (text: string): string => {
	if (/\|/g.test(text)) {
		text = '${1|' + text.replace(/\|/g, ',') + '|}';
		return text;
	}
	// text = text.replace(/\$/g, '\$');
	return text;
}

export class Completion extends CompletionItem {
	label: string;
	insertText: string | SnippetString;
	documentation?: string | MarkdownString;
	detail?: string;
	sortText?: string;

	public constructor(
		label: string,
		kind?: CompletionItemKind,
		sortText?: string,
		detail?: string,
		documentation?: string | MarkdownString,
		insertText?: string | SnippetString
	) {
		const kinds = kind === undefined ? CompletionItemKind.Function : kind;
		super(label, kind);
		this.label = label;
		this.kind = kinds;
		this.sortText = sortText === undefined ? this.setSortTextDefault() : sortText;
		this.detail = detail;
		this.documentation = documentation
		this.insertText = insertText;
	}

	private setSortTextDefault(): string {
		const text = this.label.charAt(0);
		return text === '-' ? 'z' : text;
	}

	static simple(items: string[]): Completion[] {
		const completion: Completion[] = [];
		items = [...new Set(items)];
		items.sort();
		items.forEach(value => {
			const item = new Completion(value, kind.Class, undefined, TAG, `${TAG} ${value}`, value);

			completion.push(item);
		});
		return completion;
	}

	static simpleRangeSpace(items: string[], document: TextDocument, position: Position): Completion[] {
		const completion: Completion[] = [];
		const doc = new DocumentHelper(document, position);
		Completion.simple(items)?.forEach(item => {
			item.range = doc.rangeAtSpace();
			completion.push(item);
		})
		return completion;
	}

	static emmetPropCss(position?: Position): Completion[] {
		const completion: Completion[] = [];
		emmetCss().forEach(value => {
			const item = new Completion(value.property, kind.Class, 'a', TAG, `${TAG} ${value.property}`);
			item.insertText = new SnippetString(value.property + ': \${0};');
			item.command = {
				title: '',
				command: COMMAND_EMMET_CSS_PROPERTY_SELECTED,
				arguments: [value, position]
			}
			completion.push(item);
		});
		return completion;
	}

	static emmetPropCssWhihoutCommand(): Completion[] {
		const completion: Completion[] = [];
		emmetCss().forEach(value => {
			const prop = value.property;
			const item = new Completion(prop, kind.Class, 'a', TAG, `${TAG} : ${prop}`, prop);
			completion.push(item);
		});
		return completion;
	}
}

