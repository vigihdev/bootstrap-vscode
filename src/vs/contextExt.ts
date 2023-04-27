import * as fs from "fs";
import * as path from "path";
import { workspace } from "vscode";
import { getWorkspaceUri } from "./util";

const fileName = path.join(...[__dirname, '../../', 'vendor', 'db', 'extension.json']);

type TOptionContextExt =
	"extensionPath" |
	"extensionID" |
	"dbPath" |
	"workspaceFolder" |
	"workspaceFolders";

const getData = (): Object => {
	let result = new Object(null);
	if (fs.existsSync(fileName)) {
		const file = fs.readFileSync(fileName, 'utf8');
		return typeof JSON.parse(file) === 'object' ? JSON.parse(file) : result;
	}
	return result;
}

export class ContextExt {

	static getVendorDB(): string {
		return getData().hasOwnProperty('dbPath') ? getData()['dbPath'] : '';
	}

	static getExtension(attribute: TOptionContextExt): string {
		return getData().hasOwnProperty(attribute) ? getData()[attribute] : '';
	}

	static getConfiguration<T>(section: string): T | undefined {
		return workspace.getConfiguration('', getWorkspaceUri()).get<T>(section);
	}
}