import { Position, TextDocument, Range } from "vscode";


export interface IListDocument {
	line: number;
	text: string;
	character: number;
	position: Position;
}

const removeBlockComment = (text: string): string => text.replace(/\/\*[^\r]+?\*\//gi, '');
const blockComment = (text: string): boolean => new RegExp(/\/\*|\*|\*\/|\/\//gi).test(text);

export const getListDocument = (document: TextDocument): IListDocument[] => {
	const docList: IListDocument[] = []
	for (let i = 0; i < document.lineCount; i++) {
		const text = document.lineAt(i).text;
		docList.push({
			line: i,
			text: text,
			character: text.length,
			position: new Position(i, text.length)

		});
	}
	return docList;
}

const textLineBeforePosition = (regex: RegExp, document: TextDocument, position: Position): IListDocument | undefined => {
	return getListDocument(document)
		.filter(text => !blockComment(text.text))
		.filter(text => text.line <= position.line)
		?.filter(text => new RegExp(regex).test(text.text))
		?.filter(text => Math.max(text.line))
		?.pop();
}

const textLineAfterPosition = (regex: RegExp, document: TextDocument, position: Position): IListDocument | undefined => {
	return getListDocument(document)
		.filter(text => !blockComment(text.text))
		?.filter(text => new RegExp(regex).test(text.text))
		?.filter(text => text.line >= position.line)
		?.slice(0, 1)
		?.pop();
}


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

	private getLineRangeAtRegexExp(start: RegExp, end: RegExp): Range | undefined {
		const dStart = textLineBeforePosition(start, this.document, this.position);
		if (dStart) {
			const position = new Position(dStart.line + 1, dStart.character);
			const dEnd = textLineAfterPosition(end, this.document, position);
			if (dEnd) {
				return new Range(dStart.position, dEnd.position)
			}
		}
		return undefined;
	}

	// FITUR
	rangeAtHtmlClassPhp(): Range | undefined {
		return this.getWordRangeAt(/'class'.*=>.*?'[a-z-A-Z-0-9-_\s']+/g);
	}

	rangeAtHtmlClass(): Range | undefined {
		return this.getWordRangeAt(/class="[a-z-A-Z-0-9-\s<]+.*?"/gi);
	}

	rangeAtSpace(): Range | undefined {
		const range = this.getWordRangeAt(/\s[a-z-A-Z-0-9-_]+/g);
		if (range) {
			return new Range(new Position(range.start.line, (range.start.character + 1)), range.end);
		}
		return undefined;
	}

	rangeAtStyles(): Range | undefined {
		// <body style="background-color:powderblue;">
		return this.getWordRangeAt(/style="[a-z-A-Z-0-9-\s]+.*?"/gi);
	}

	rangeAtCssJquery(): Range | undefined {
		return this.getWordRangeAt(/\)\.css\([^\r]+?\)/g);
	}

	rangeAtAddCssJquery(): Range | undefined {
		return this.getWordRangeAt(/class="[a-z-A-Z-0-9-\s]+.*?"/gi);
	}

	rangeLineAtByRegexExp(start: RegExp, end: RegExp): Range | undefined {
		const rangeLine = this.getLineRangeAtRegexExp(start, end);
		const line = this.position.line;
		if (rangeLine && rangeLine.start.line <= line && rangeLine.end.line > line) {
			return rangeLine;
		}
		return undefined;
	}

	// END FITUR
}