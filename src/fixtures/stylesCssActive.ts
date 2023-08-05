import { Completion, Markdown, Snippets, simpleCompletions } from "@vigihdev/vs2-code";
import path = require("path");
import { ExtensionContext, languages, CompletionItem, Uri, Range, Position, SnippetString, commands, window, TextLine } from "vscode";
import { TAG, kind } from "../constant";
import { snippetEmmets } from "../api/snippets";
import { timeout } from "@vigihdev/vs-utils/out/async";

interface ILineAt {
	index: number;
	text: string;
}

interface IEmmetCss {
	perfix: string;
	label: string;
	documentaion: string;
	choice: string;
	insertText?: string;
}

function mapLineAt(text: string): ILineAt[] {
	const results: ILineAt[] = [];
	text.split('').forEach((v: string, i: number) => results.push({ index: i, text: v }))
	return results;
}

export async function stylesCssActive(context: ExtensionContext): Promise<void> {
	let itemsEmmet = await snippetEmmets();

	const provider = languages.registerCompletionItemProvider(['php', 'html', 'javascript'], {
		async provideCompletionItems(document, position, token, ctx): Promise<CompletionItem[]> {
			const completion: CompletionItem[] = [];

			const [textPos, line, character] = [document.lineAt(position).text.slice(0, position.character), position.line, position.character,];
			const rangeAt = (regex: RegExp) => document.getWordRangeAtPosition(position, regex);

			// style
			const R0 = /style.*/
			const R1 = /style=".*?"/
			const R2 = /style['=>\s]+.*?'/
			const RVAL = /[\w\d\s,"'#!%\(\):;\-]+/
			let rangeStyles = rangeAt(new RegExp(`(?:${R1.source}|${R2.source})`));
			let rangeInValue = rangeAt(/:(?:\s|).*?;/);

			if (rangeAt(R0) && rangeStyles) {
				// console.log('active');
				let rProp = rangeAt(/[:\w\s]+?;/);
				let rValue = rangeAt(/:\s(?:\w+|);/);

				if (rangeInValue) {
					let label = textPos.match(/[\w\d-]+?:/g)?.pop()?.replace(/:/g, '')
					let emmet = label ? itemsEmmet?.filter(t => t.label === label) : undefined
					if (ctx.triggerCharacter === ' ') {
						if (emmet) {
							commands.executeCommand('EmmetPropertySelected', emmet.pop())
						}
						return undefined;
					}

					if (emmet) {
						let labels: string[] = [];
						emmet.map(t => t.documentaion.split('|')).forEach(async t => {
							const items = simpleCompletions(t, kind.Value, undefined, `${TAG} Styles`)
							completion.push(...items)
							// return Promise.resolve(completion);
						});
					}
				}

				if (!rangeInValue) {
					itemsEmmet?.forEach(emmet => {
						const items = new Completion({ label: emmet.label }, kind.Value).setItemDescription(`${TAG} Styles`)
						items.setInsertText(new Snippets(`${emmet.label}: \${1};`))
						items.command = {
							command: 'EmmetPropertySelected', title: 'emmetPropCss', arguments: [emmet]
						}
						completion.push(items)
					})
				}
			}

			return Promise.resolve(completion);
		},
	}, ' ', ':');

	context.subscriptions.push(provider);
	commands.registerCommand('EmmetPropertySelected', onEmmetPropertySelected);
}

async function onEmmetPropertySelected(item: IEmmetCss) {
	const editor = window.activeTextEditor;
	let choice = item?.choice
	// console.log(item);

	if (editor && choice) {
		const cursor = editor.selection.active;
		let lineAt: TextLine = editor.document.lineAt(cursor);
		const index = mapLineAt(lineAt.text)?.filter(t => t.index < cursor.character && t.text === ' ')?.pop()?.index
		const index1 = mapLineAt(lineAt.text)?.filter(t => t.index >= cursor.character && t.text === ';')?.[0]?.index

		const range = new Range(new Position(cursor.line, index), new Position(cursor.line, index1))
		let snippet = new SnippetString(`\${1|${choice.replace(/\|/g, ',')}|}`);

		editor.edit(editBuilder => {
			editBuilder.replace(range, ' ')
			editor.insertSnippet(snippet)
			timeout(200).then(() => {
			})
		})

	}
}