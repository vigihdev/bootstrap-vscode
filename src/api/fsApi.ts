import { timeout } from "@vigihdev/vs-utils/out/async";
import * as fs from "fs";
import * as path from "path";
import { RelativePattern, Uri, workspace } from "vscode";

const basePath = workspace.workspaceFolders?.[0]?.uri?.path

function isFile(fileName: string): boolean {
	return fs.existsSync(fileName) && fs.lstatSync(fileName).isFile();
}

function isDir(fileName: string): boolean {
	return fs.existsSync(fileName) && fs.lstatSync(fileName).isDirectory();
}

function info(fileName: string): path.ParsedPath {
	return path.parse(fileName)
}

function isFileJs(fileName: string): boolean {
	return isFile(fileName) && fileName.slice(-3, 3) === '.js';
}

function isFilePhp(fileName: string): boolean {
	return isFile(fileName) && fileName.slice(-4) === '.php';
}

function isFileHtml(fileName: string): boolean {
	return isFile(fileName) && fileName.slice(-5) === '.html';
}

function isFileCss(fileName: string): boolean {
	return isFile(fileName) && info(fileName).ext === '.css';
}

function isFileMinCss(fileName: string): boolean {
	return isFile(fileName) && fileName.slice(-8) === '.min.css';
}

async function saveDb(name: string, content: string[]) {
	return new Promise(resolve => {
		let paths = path.join(...[__dirname, '..', 'db']);

		if (!isDir(paths)) {
			try {
				fs.mkdirSync(paths);
			} catch (err) {
			}
		}

		if (isDir(paths)) {
			try {
				const wr = fs.writeFileSync(path.join(...[paths, name]), JSON.stringify(content, null, 4));
				resolve(true);
			} catch (error) {
				resolve(undefined);
			}
		} else {
			resolve(undefined);
		}
	})
}

function workPattern(pattern: string): RelativePattern {
	const folder = workspace.workspaceFolders?.[0];
	return folder ? new RelativePattern(folder, pattern) : undefined;
}

const Reg = {
	BODYCSS: /[\n?\w\d:\s,;@#!%'"\(\)\.\/-]+/,
	COMMENT: /\/\*[-\n\s\w\d:,\.]+?\*\//,
	MEDIA: /@media\s\(.*\)(?:\s|)?{/
}

const PATTERN = {
	CSS: /^\.[-\w\d_\.,:\s]+/gm
}

export async function initializeFileCss(): Promise<boolean> {
	return new Promise(async resolve => {
		if (basePath) {
			let cssResult: string[] = [];
			const fileCss = await workspace.findFiles(workPattern('**/**/*.css'), '**/*.min.css')

			fileCss?.forEach(async uri => {
				// let content = await readFile(uri)
				let cssContent = await readFile(uri)
				let restCssContent: string[][] = cssContent.match(PATTERN.CSS)?.map(t => t.replace(/[\n,]+/g, ''))
					?.map(t => t.replace(/\./g, ' ').replace(/\s+/g, ' ').trim())
					?.map(t => t.replace(/:/g, '::').replace(/::[-\w]+/g, '').replace(/::/g, '').trim())
					?.map(t => t.split(' '))

				restCssContent?.forEach(css => {
					css?.forEach(item => {
						if (item?.length > 2) {
							cssResult.push(item)
						}
					})
				})
			})

			timeout(1000).then(() => {
				cssResult = [...new Set(cssResult)]
				cssResult = cssResult.sort();
				saveDb('bootstrap.json', cssResult);
				resolve(true);
			})

		} else {
			resolve(false)
		}
	});
}

export async function readFile(fileUri: Uri): Promise<string> {
	return new Promise<string>(async resolve => {
		if (isFile(fileUri.path)) {
			const content = await workspace.fs.readFile(fileUri)
			resolve(`${content}`)
		} else {
			resolve(undefined);
		}
	})
}

export async function readFileJson<T>(fileUri: Uri): Promise<T> {
	return new Promise<T>(async resolve => {
		if (isFile(fileUri.path)) {
			try {
				const content = await workspace.fs.readFile(fileUri)
				resolve(<T>JSON.parse(`${content}`))
			} catch (error) {
				resolve(<T>undefined);
			}
		} else {
			resolve(<T>undefined);
		}
	})
}