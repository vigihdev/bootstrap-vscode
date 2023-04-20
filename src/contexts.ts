import * as fs from "fs";
import * as path from "path";

const fileName = path.join(...[__dirname, '../', 'vendor', 'db', 'extension.json']);
type OptionExtension =
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

export class Contexts {

	static getVendorDB(): string {
		return getData().hasOwnProperty('dbPath') ? getData()['dbPath'] : '';
	}

	static getExtension(attribute: OptionExtension): string {
		return getData().hasOwnProperty(attribute) ? getData()[attribute] : '';
	}
}