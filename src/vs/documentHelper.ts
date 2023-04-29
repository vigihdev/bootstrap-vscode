import { Position, TextDocument, Range, TextLine } from "vscode";
import { isCharaterEndSpace, isCharaterStartSpace, textEndSpace } from "./util";

export interface IListDocument {
	line: number;
	text: string;
	character: number;
	position: Position;
}

export interface ITextLineOption {
	startSpace: boolean;
}

export interface ITextLineStart extends ITextLineOption {
	text: string;
	character: number;
	position: Position;
	line: number;
}

export interface ITextLineEnd extends ITextLineOption {
	text: string;
	character: number;
	position: Position;
	line: number;
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

class TextLineAt {

	private position: Position;
	private textLine: TextLine;

	start: ITextLineStart;
	end: ITextLineEnd;

	constructor(textLine: TextLine, position: Position) {
		this.textLine = textLine;
		this.position = position;
		const line = position.line;
		const character = position.character;
		const text1 = textLine.text.substr(0, character)
		const text2 = textLine.text.substr(character)

		this.start = {
			text: text1, character: text1.length,
			line: line, position: new Position(line, text1.length),
			startSpace: isCharaterStartSpace(text1)
		}
		this.end = {
			text: text2, character: text2.length,
			line: line, position: new Position(line, text2.length),
			startSpace: isCharaterStartSpace(text2)
		}
	}

	rangeAtSpace(): Range | undefined {

		if (!isCharaterEndSpace(this.start.text)) {
			const character1 = this.start.text.length
			const character2 = textEndSpace(this.start.text).length;
			const character = character1 - character2;
			const line = this.start.line;
			const range = new Range(new Position(line, character), new Position(line, character));
			return range;
		}
		return undefined;
	}

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

	getTextLine(): TextLineAt {
		return new TextLineAt(this.document.lineAt(this.position), this.position)
	}

	// FITUR
	rangeAtHtmlClassPhp(): Range | undefined {
		return this.getWordRangeAt(/'class'.*=>.*?'[a-z-A-Z-0-9-_\s']+/g);
	}

	rangeAtHtmlClass(): Range | undefined {
		return this.getWordRangeAt(/class="[a-z-A-Z-0-9-\s<]+.*?"/gi);
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