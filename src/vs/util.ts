import { isString } from "../common/types";
import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import { Uri, workspace } from "vscode";
import { FILENAME_BOOTSTRAP4, FILENAME_EXTENSION, FILENAME_YII2_ASSETS } from "../constant";
import { ContextExt } from "./contextExt";

export const toStrings = (text: any): string => isString(text) ? text : '';
export const toArray = (text: any): string[] => Array.isArray(text) ? text : [];

export const toUnique = (items: string[]): string[] => [...new Set(items)];

export const fileNameExt = ContextExt.getExtension('dbPath') + path.sep + FILENAME_EXTENSION;
export const fileNameBs4 = ContextExt.getExtension('dbPath') + path.sep + FILENAME_BOOTSTRAP4;
export const fileNameYii2 = ContextExt.getExtension('dbPath') + path.sep + FILENAME_YII2_ASSETS;

export function isFile(fileName: string): boolean {
	return fs.existsSync(fileName) && fs.lstatSync(fileName).isFile();
}

export function isFileJs(fileName: string): boolean {
	return isFile(fileName) && fs.existsSync(fileName) && fileName.substr(-3) === '.js';
}

export function isFilePhp(fileName: string): boolean {
	return isFile(fileName) && fs.existsSync(fileName) && fileName.substr(-4) === '.php';
}

export function isFileHtml(fileName: string): boolean {
	return isFile(fileName) && fs.existsSync(fileName) && fileName.substr(-5) === '.html';
}

export function isFileCss(fileName: string): boolean {
	return isFile(fileName) && fs.existsSync(fileName) && fileName.substr(-4) === '.css';
}

export function isFileMinCss(fileName: string): boolean {
	return isFile(fileName) && fs.existsSync(fileName) && fileName.substr(-8) === '.min.css';
}

// Block Has
export function hasWorkspaceYii2(): boolean {
	const pathYii2 = path.join(...[getWorkspacePath(), 'vendor', 'yiisoft', 'yii2']);
	return fs.existsSync(pathYii2) && fs.lstatSync(pathYii2).isDirectory();
}

export function hasWorkspaceWordpress(): boolean {
	return false;
}
// ENd Block Has


export function removeBlockComment(text: string): string {
	text = text.replace(/\/\*.*/g, '')
		.replace(/\*.*/g, '')
		.replace(/\*\/.*/g, '')
		.replace(/\/\/.*/g, '')
	return text;
}

export function removeBodyCss(text: string): string {
	text = text.replace(/{.*[^\r]+?}/g, '')
	text = text.replace(/[a-z-A-z-0-9-]+.:.*?;/g, '')
	return text;
}

export function removeSelectorCss(text: string): string {
	text = text.replace(/\w+:[a-z-A-z-0-9]+\(.*?\)/g, '')
	return text;
}


export function getWorkspacePath(): string {
	return workspace.workspaceFolders[0].uri.path
}
export function getWorkspaceUri(): Uri {
	return workspace.workspaceFolders[0].uri
}