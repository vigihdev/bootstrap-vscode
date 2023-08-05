import { Documents, simpleCompletions } from "@vigihdev/vs2-code";
import { existsSync, lstatSync } from "fs";
import path = require("path");
import { ExtensionContext, languages, CompletionItem, Uri, Range, Position } from "vscode";
import { readFile } from "../api/fsApi";
import { TAG, kind } from "../constant";


function isFile(fileName: string): boolean {
	return existsSync(fileName) && lstatSync(fileName).isFile();
}

function isDir(fileName: string): boolean {
	return existsSync(fileName) && lstatSync(fileName).isDirectory();
}

export async function bootstrapActive(context: ExtensionContext): Promise<void> {

	const provider = languages.registerCompletionItemProvider(['php', 'html', 'javascript'], {
		async provideCompletionItems(document, position, token, ctx): Promise<CompletionItem[]> {
			const completion: CompletionItem[] = [];

			const [textPos, line, character] = [document.lineAt(position).text.slice(0, position.character), position.line, position.character,];
			const rangeAt = (regex: RegExp) => document.getWordRangeAtPosition(position, regex);

			// class
			const [R0, R1, R2] = [/class.*/, /class=".*?"/, /class['=>\s]+.*?'/]

			const Rclass = rangeAt(new RegExp(`(?:${R1.source}|${R2.source})`));
			if (rangeAt(R0) && Rclass) {
				const fileName = path.join(...[__dirname, '..', 'db', 'bootstrap.json']);
				if (isFile(fileName)) {
					let content = await readFile(Uri.parse(fileName))
					let data: string[] = JSON.parse(content);
					let items = simpleCompletions(data, kind.Class, TAG, TAG)
					let index = textPos.match(/[\w\d-]+$/)?.index
					if (index) {
						let range = new Range(new Position(line, index), position)
						items = items.map(i => i.setRange(range))
					}
					completion.push(...items)
				}
			}
			return Promise.resolve(completion);
		},
	}, ' ', '-');

	context.subscriptions.push(provider);
}
