import { existsSync, lstatSync } from "node:fs";
import path = require("node:path");
import { readFileJson } from "./fsApi";
import { Uri } from "vscode";


interface IEmmetCss {
	perfix: string;
	label: string;
	documentaion: string;
	choice: string;
	insertText?: string;
}

const dbPath = path.join(...[__dirname, '..', 'db', 'emmet', 'snippets'])

// Placeholders
const Place = /\${\d+.*?}/

function isFile(fileName: string): boolean {
	return existsSync(fileName) && lstatSync(fileName).isFile();
}

function isDir(fileName: string): boolean {
	return existsSync(fileName) && lstatSync(fileName).isDirectory();
}

function parseToDocumentaion(snippet: string): string {
	if (test(Place, snippet)) {
		snippet.match(Reg(Place, 'g'))?.forEach(item => {
			let value: string = item.replace(/\${\d+(?::|)|}/g, '')
			snippet = snippet.replace(item, value)?.trim()
			snippet = snippet?.charAt(0) === '|' ? snippet.slice(1) : snippet
		})
	}
	return snippet;
}

function parseToChoice(snippet: string): string {
	if (/\(.*\)/.test(snippet)) {
		snippet = snippet.replace(/,/g, '\\,')
	}
	return snippet;
}

function test(r: RegExp, text: string): boolean {
	return r.test(text);
}

const Reg = (pattern: string | RegExp, flags?: string) => new RegExp(pattern, flags);

export async function snippetEmmets(): Promise<IEmmetCss[]> {
	return new Promise(async resolve => {
		const results: IEmmetCss[] = [];
		if (isDir(dbPath) && isFile(path.join(...[dbPath, 'css.json']))) {
			const content = await readFileJson<Object>(Uri.parse(path.join(...[dbPath, 'css.json'])))
			let value: string, key: string, documentaion: string, insertText: string, values: string, label: string,
				choice: string;
			for ([key, value] of Object.entries(content)) {

				label = value?.match(/[\w\d-]+?:/)?.[0]
				if (key.charAt(0) !== '@' && label && isNaN(parseInt(label.charAt(0)))) {
					values = value.replace(label, '')

					label = label.slice(0, -1)
					documentaion = parseToDocumentaion(values)
					choice = parseToChoice(documentaion)
					results.push({ perfix: key, label: label, documentaion: documentaion, choice: choice })
					// console.log(label);
					// console.log(choice);
				}

				let label1: string = value?.match(/[\w\d-]+/)?.[0]
				if (key.charAt(0) !== '@' && label1 && !test(/[\w\d-]+?:/, value) && isNaN(parseInt(label1.charAt(0)))) {
					results.push({ perfix: key, label: label1, documentaion: undefined, choice: undefined })
				}
			}
			resolve(results)
		} else {
			resolve(results)
		}
	})
}