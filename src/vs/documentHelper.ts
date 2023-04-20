import { Position, TextDocument, Range } from "vscode";

export class DocumentHelper {
	line: number;
	text: string;
	textLength: number;
	character: number;

	private document: TextDocument;
	private position: Position;

	constructor(document: TextDocument, position: Position) {
		const textLine = document.lineAt(position);
		this.document = document;
		this.position = position;
		this.line = textLine.lineNumber;
		this.text = textLine.text;
		this.textLength = textLine.text.length;
		this.character = position.character;
	}

	rangeAtHtmlClassPhp(): Range | undefined {
		return this.document.getWordRangeAtPosition(this.position, /'class'.*=>.*'[a-z-A-Z-0-9-\s]+.*?'/g);
	}

	rangeAtHtmlClass(): Range | undefined {
		return this.document.getWordRangeAtPosition(this.position, /class="[a-z-A-Z-0-9-\s]+.*?"/gi);
	}

	rangeAtSpace(): Range | undefined {
		const range = this.document.getWordRangeAtPosition(this.position, /\s[a-z-A-Z-0-9-_]+/g);
		if (range) {
			return new Range(new Position(range.start.line, (range.start.character + 1)), range.end);
		}
		return undefined;
	}
}