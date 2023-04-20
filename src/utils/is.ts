import * as path from "path";
import * as fs from "fs";

export function isFileJs(fileName: string): boolean {
	return fs.existsSync(fileName) && fileName.substr(-3) === '.js';
}

export function isFilePhp(fileName: string): boolean {
	return fs.existsSync(fileName) && fileName.substr(-4) === '.php';
}

export function isFileHtml(fileName: string): boolean {
	return fs.existsSync(fileName) && fileName.substr(-5) === '.html';
}

export function isFileCss(fileName: string): boolean {
	return fs.existsSync(fileName) && fileName.substr(-4) === '.css';
}

export function isFileMinCss(fileName: string): boolean {
	return fs.existsSync(fileName) && fileName.substr(-8) === '.min.css';
}