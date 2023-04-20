import { ExtensionContext, workspace } from "vscode";
import { saveFile } from "./fs2/files";
import path = require("path");

interface IExtensionInit {
	extensionPath: string;
	extensionID: string;
	dbPath: string;
	workspaceFolder: string;
	workspaceFolders: string[];
}

const VENDOR_DB = 'vendor/db';
export class ExtensionInit {
	private context: ExtensionContext;

	static from(context: ExtensionContext): ExtensionInit {
		return new ExtensionInit(context)
	}

	constructor(context: ExtensionContext) {
		this.context = context;
		this.init();
	}

	private async init(): Promise<void> {

		const data: IExtensionInit = {
			extensionPath: this.context.extensionPath,
			extensionID: this.context.extension.id,
			dbPath: this.context.extensionPath + path.sep + VENDOR_DB,
			workspaceFolders: workspace.workspaceFolders.map(work => work.uri.path),
			workspaceFolder: workspace.workspaceFolders.map(work => work.uri.path)?.slice(0, 1).pop()
		};

		const dbPath = this.context.extensionPath + path.sep + VENDOR_DB + path.sep + 'extension.json';
		const success = await saveFile(dbPath, JSON.stringify(data, null, 4))
	}
}