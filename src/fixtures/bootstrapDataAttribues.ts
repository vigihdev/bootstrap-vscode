import { simpleCompletions } from "@vigihdev/vs2-code";
import { ExtensionContext, languages, CompletionItem } from "vscode";
import { TAG, kind } from "../constant";

export async function bootstrapDataAttribues(context: ExtensionContext): Promise<void> {

	const provider = languages.registerCompletionItemProvider(['php', 'html', 'javascript'], {
		async provideCompletionItems(document, position, token, ctx): Promise<CompletionItem[]> {
			const completion: CompletionItem[] = [];
			const [textPos, line, character] = [document.lineAt(position).text.slice(0, position.character), position.line, position.character];
			const rangeAt = (regex: RegExp) => document.getWordRangeAtPosition(position, regex);

			// Blank
			const R0 = /data-[\w-]+/
			const R1 = /=".*?"/
			const R2 = /['"=>\s]+.*?'/
			const rangeData = rangeAt(/data-(?:\w+|)/)
			const rangeValue = rangeAt(new RegExp(`${R0.source}(?:${R1.source}|${R2.source})`))

			if (rangeValue) {
				const items = simpleCompletions(dataValueAttribues, kind.Text, `${TAG} Data`, `${TAG} Data`)
				completion.push(...items)
			}

			if (textPos?.slice(-5) === 'data-' || rangeData) {
				const items = simpleCompletions(dataAttribues, kind.Text, `${TAG} Data`, `${TAG} Data`)
				completion.push(...items)
			}

			return Promise.resolve(completion);
		},
	}, '-');

	context.subscriptions.push(provider);
}
const dataAttribues = [
	'animation',
	'autohide',
	'boundary',
	'browse',
	'container',
	'content',
	'delay',
	'dismiss',
	'display',
	'fallbackPlacement',
	'flip',
	'html',
	'interval ',
	'keyboard',
	'offset',
	'parent',
	'pause',
	'placement',
	'popperConfig',
	'reference',
	'ride',
	'sanitize',
	'sanitizeFn',
	'selector',
	'spy',
	'target',
	'template',
	'title',
	'toggle',
	'touch',
	'trigger',
	'whiteList',
	'wrap'
];

const dataValueAttribues = [
	'alert',
	'buttons',
	'button',
	'slide',
	'carousel',
	'collapse',
	'target',
	'modal',
	'title',
	'content',
	'scroll',
	'tab',
	'pill',
	'spy',
	'close',
	'dropdown',
	'caret',
	'top',
	'tooltip',
	'bottom',
	'tooltip',
	'left',
];