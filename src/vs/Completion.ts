
import { CompletionItem, CompletionItemKind, MarkdownString, SnippetString } from 'vscode';
import { TAG, kind } from '../constant';

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
			const item = new Completion(value, kind.Class, 'a', TAG, TAG + ' ' + value, value);
			completion.push(item);
		});
		return completion;
	}
}

