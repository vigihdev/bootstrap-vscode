import * as fs from "fs";
import * as path from "path";
import { TextDocument, Uri, workspace } from "vscode";
import { isFileCss } from "./utils/is";
import { Contexts } from "./contexts";
import { FILENAME_EXTENSION } from "./constant";
import { readFileJson, saveFile } from "./fs2/files";
import { mixin } from "./common/objects";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function exist(fileName: string): boolean {
	return fs.existsSync(fileName);
}

export function getWorkspaceFirst(): TextDocument | undefined {
	return workspace.textDocuments.slice(0, 1).pop();
}

export function getWorkspaceFoldersFirst(): Uri | undefined {
	return workspace.workspaceFolders.slice(0, 1)?.pop()?.uri;
}

export async function openDocumentWebAssets(): Promise<string[]> {

	return new Promise<string[]>(async resolve => {
		const file = await workspace.findFiles('**/web/assets/**/*.css');
		let result: string[] = [];
		file.forEach(async (uri: Uri) => {
			if (isFileCss(uri.path)) {
				const docs = await workspace.openTextDocument(uri.path);
				let text = docs.getText()
					.replace(/{.*[^\r]+?}/g, '')
					.replace(/\/\*.*|@.*|\*.*|\*\/.*|:.[a-z-A-Z-]+/g, '')
					.replace(/[a-z-A-Z-]+\(.*?\)/g, '')
					.replace(/\[.*?\]/g, '')
					.match(/\.[a-z-A-Z-0-9-_]+/g);

				if (Array.isArray(text)) {
					let newdata = text.map(d => d.substr(1)).filter(d => isNaN(parseInt(d.charAt(0))))
					newdata.sort();
					result.push(...new Set(newdata));
				}
			}
		});
		delay(200).then(() => {
			result.sort();
			result = [...new Set(result)]
			resolve(result);
		})
	});
}

export function updateActivateCompletion(activateCompletion: string): void {
	const fileExt = Contexts.getExtension('dbPath') + path.sep + FILENAME_EXTENSION;
	const data = readFileJson<Object>(fileExt);
	if (data) {
		const newData = JSON.stringify(mixin(data, { activateCompletion: activateCompletion }), null, 4);
		saveFile(fileExt, newData);
	}
}
