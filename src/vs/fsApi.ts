import * as fs from "fs";
import * as path from "path";
import * as https from "node:https";
import { IncomingMessage } from "http";
import { getWorkspacePath, hasWorkspaceYii2, isFileCss, isFileMinCss, removeBlockComment, removeBodyCss, removeSelectorCss, toArray, toStrings, toUnique } from "./util";
import { glob } from "glob";
import { ContextExt } from "./contextExt";
import { rtrim } from "../common/strings";
import { FILENAME_YII2_ASSETS, VENDOR_BIN_SERVER } from "../constant";
import { workspace } from "vscode";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";

const bootstrap = 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css';
const vendorBinServer = ContextExt.getExtension('extensionPath') + path.sep + VENDOR_BIN_SERVER;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// export async function getContent(url: string): Promise<string> {
// 	return new Promise<string>((resolve, reject) => {
// 		https.get(url, (res: IncomingMessage) => {
// 			if (res.statusCode === 200) {
// 				const chunks = [];
// 				res.setEncoding('utf-8');
// 				res.on('data', (data: string) => {
// 					chunks.push(data);
// 				});

// 				res.on('end', () => {
// 					resolve(chunks.join(''))
// 				})
// 			}
// 		}).on('error', (e) => {
// 			reject(e);
// 		});
// 	})
// }

// export async function getContentBootstrap4Url(): Promise<string[]> {
// 	return new Promise<string[]>(async (resolve) => {
// 		const data = await getContent(bootstrap);
// 		const result: string[] = [];
// 		if (data.length > 0) {
// 			let content = data
// 				.replace(/\/\*.*/g, '')
// 				.replace(/\*\s.*/g, '')
// 				.replace(/\*\//g, '')
// 				.replace(/{.*?}/g, '')
// 				.replace(/\[.*?\]/g, '')
// 				.replace(/:[:a-z-A-Z\(]+.*?\)/g, '')
// 				.replace(/[>+]+/g, '')
// 				.match(/\.[\w+-]+/g);

// 			if (Array.isArray(content)) {
// 				let newdata = content.map(d => d.substr(1)).filter(d => isNaN(parseInt(d.charAt(0))))
// 				newdata.sort();
// 				result.push(...new Set(newdata))
// 			}
// 			resolve(result);
// 		}
// 		resolve(result);
// 	});
// }

export async function saveFile(fileName: string, content: string): Promise<boolean> {
	return new Promise<boolean>(resolve => {
		const paths = path.parse(fileName);
		if (fs.existsSync(paths.dir)) {
			fs.writeFileSync(fileName, content);
			if (fs.existsSync(fileName)) {
				resolve(true);
			} else {
				resolve(false);
			}
		} else {
			resolve(false);
		}
	});
}

export function readFiles(fileName: string): string[] {
	const result: string[] = [];
	if (fs.existsSync(fileName)) {
		const data = fs.readFileSync(fileName, 'utf8');
		if (Array.isArray(JSON.parse(data))) {
			result.push(...JSON.parse(data))
		}
	}
	return result;
}

export function readFileJson<T>(fileName: string): T | undefined {
	let result: T;
	if (fs.lstatSync(fileName).isFile() && fileName.substr(-5) === '.json' && fs.existsSync(fileName)) {
		const data = fs.readFileSync(fileName, 'utf8');
		result = JSON.parse(data);
	}
	return result;
}

// Block scann File
export async function scannFileYii2(): Promise<string[]> {
	return new Promise<string[]>(async resolve => {
		if (hasWorkspaceYii2()) {
			const basePath = path.join(...[getWorkspacePath(), 'vendor']);
			const ignore = ContextExt.getConfiguration<string[]>('bootstrap.Yii2.settings.excludeList');
			const listdir = await glob(`${basePath}${path.sep}bower*/**/**/*.css`, { ignore: toArray(ignore) });
			resolve(listdir.filter(file => !isFileMinCss(file)));
		}
		resolve([]);
	});
}

function scannFileWordpress() {
}
// End Block scann File

// Block Update File
export async function updateFileYii2(): Promise<boolean> {
	return new Promise<boolean>(async resolve => {

		if (hasWorkspaceYii2() && fs.existsSync(ContextExt.getVendorDB()) && fs.lstatSync(ContextExt.getVendorDB()).isDirectory()) {
			const files = await scannFileYii2();
			if (files.length > 0) {
				const saveAsFile = `${ContextExt.getVendorDB()}${path.sep}${FILENAME_YII2_ASSETS}`;
				const response = await serverSaveAsFiles(`${files.join(' ')}||${saveAsFile}`);
				resolve(response);
			}
		}
		resolve(false);
	});
}
// End Block Update File

// Block Server File
export const runServer = (methodName: string, param: string): ChildProcessWithoutNullStreams => {
	return spawn('php', [vendorBinServer, `METHOD:${methodName}`, `ARG:${param}`]);
}

export async function serverSaveAsFiles(param: string): Promise<boolean> {
	return new Promise<boolean>(resolve => {
		const process = runServer(`saveAsFiles`, param);
		process.stdout.on("data", (chunk: Buffer) => {
			resolve(true)
		});
		process.stdout.on("error", () => {
			resolve(false)
		})
	})
}
// End Block Server File

