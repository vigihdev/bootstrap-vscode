import * as fs from "fs";
import * as path from "path";
import * as https from "node:https";
import { IncomingMessage } from "http";

const bootstrap = 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css';

export async function getContent(url: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		https.get(url, (res: IncomingMessage) => {
			if (res.statusCode === 200) {
				const chunks = [];
				res.setEncoding('utf-8');
				res.on('data', (data: string) => {
					chunks.push(data);
				});

				res.on('end', () => {
					resolve(chunks.join(''))
				})
			}
		}).on('error', (e) => {
			reject(e);
		});
	})
}

export async function getContentBootstrap4Url(): Promise<string[]> {
	return new Promise<string[]>(async (resolve) => {
		const data = await getContent(bootstrap);
		const result: string[] = [];
		if (data.length > 0) {
			let content = data
				.replace(/\/\*.*/g, '')
				.replace(/\*\s.*/g, '')
				.replace(/\*\//g, '')
				.replace(/{.*?}/g, '')
				.replace(/\[.*?\]/g, '')
				.replace(/:[:a-z-A-Z\(]+.*?\)/g, '')
				.replace(/[>+]+/g, '')
				.match(/\.[\w+-]+/g);

			if (Array.isArray(content)) {
				let newdata = content.map(d => d.substr(1)).filter(d => isNaN(parseInt(d.charAt(0))))
				newdata.sort();
				result.push(...new Set(newdata))
			}
			resolve(result);
		}
		resolve(result);
	});
}
