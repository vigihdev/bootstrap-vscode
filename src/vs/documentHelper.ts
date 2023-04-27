import { Position, TextDocument, Range } from "vscode";

export class DocumentHelper {
	private document: TextDocument;
	private position: Position;

	constructor(document: TextDocument, position: Position) {
		this.document = document;
		this.position = position;
	}

	private getWordRangeAt(regex: RegExp): Range | undefined {
		return this.document.getWordRangeAtPosition(this.position, regex);
	}

	rangeAtHtmlClassPhp(): Range | undefined {
		return this.getWordRangeAt(/'class'.*=>.*?'[a-z-A-Z-0-9-_\s']+/g);
	}

	rangeAtHtmlClass(): Range | undefined {
		return this.getWordRangeAt(/class="[a-z-A-Z-0-9-\s]+.*?"/gi);
	}

	rangeAtSpace(): Range | undefined {
		const range = this.getWordRangeAt(/\s[a-z-A-Z-0-9-_]+/g);
		if (range) {
			return new Range(new Position(range.start.line, (range.start.character + 1)), range.end);
		}
		return undefined;
	}
}