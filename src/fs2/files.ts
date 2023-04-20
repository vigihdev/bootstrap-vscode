import * as fs from "fs";
import * as path from "path";

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
	if (fs.existsSync(fileName)) {
		const data = fs.readFileSync(fileName, 'utf8');
		result = JSON.parse(data);
	}
	return result;
}
