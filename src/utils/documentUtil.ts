import * as path from "path";
import * as fs from "fs";
import { Uri, workspace } from "vscode";
import { trim } from "../common/strings";

const truncateText = (text: string): string => {
	text = text.replace(/[,{]+/g, '');
	text = text.replace(/::[a-z-A-Z]+/g, '');
	text = text.replace(/:[a-z-A-Z]+/g, '');
	text = text.replace(/\./g, ' ');
	return text;
}

export async function openDocumentPath(path: string): Promise<string[]> {

	let result: string[] = [];
	if (fs.existsSync(path)) {
		const document = await workspace.openTextDocument(Uri.parse(path));
		for (let i: number = 0; i < document.lineCount; i++) {
			let text = document.lineAt(i).text;

			if (text.startsWith('.')) {
				if (text.endsWith('{') || text.endsWith(',')) {
					text = text.replace(/[,{]+/g, '');
					text = text.replace(/::[a-z-A-Z]+/g, '');
					text = text.replace(/:[a-z-A-Z]+/g, '');
					text = text.replace(/\./g, ' ');
					let textArr = text.split(' ').filter(t => t.length > 2);
					textArr = [...new Set(textArr)];
					result.push(...textArr)
				}
			}
		}
	}
	result = [...new Set(result)];
	return result.sort();
}


export async function openDocumentCssPath(path: string): Promise<string[]> {
	let result: string[] = [];
	if (fs.existsSync(path)) {
		const document = await workspace.openTextDocument(Uri.parse(path));
		for (let i: number = 0; i < document.lineCount; i++) {
			let text = document.lineAt(i).text;

			if (text.startsWith('.')) {
				if (text.endsWith('{') || text.endsWith(',')) {
					text = truncateText(text);
					let textArr = text.split(' ').map(t => trim(t)).filter(t => t.length > 2);
					result.push(...textArr)
				}
			}
		}
	}
	result = [...new Set(result)];
	return result.sort();
}
