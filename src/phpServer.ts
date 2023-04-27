import * as net from "node:net";
import * as fs from "node:fs";
import * as path from "node:path";
import { spawn } from "node:child_process";
import { ExtensionContext } from "vscode";

// const basePath = Constants.extension<{ extensionPath: string }>()?.extensionPath;
const serverPath = path.join('', ...['vendor', 'bin', 'server.php']);

// export async function phpServerActivate(): Promise<void> {

// 	const serverOptions = () => new Promise((resolve, reject) => {


// 	});
// 	serverOptions();
// }
function server(context: ExtensionContext) {
	const serverPath = path.join(context.extensionPath, ...['vendor', 'bin', 'server.php']);
	if (fs.existsSync(serverPath)) {
		const process = spawn('php', [serverPath]);
		process.stdout.on("data", (chunk: Buffer) => {
			console.log(chunk.toString('utf-8'));
		});

		process.stderr.on("error", (chunk: Buffer) => {
		});

	}

}

export async function testServer(context: ExtensionContext): Promise<boolean> {
	server(context);
	return new Promise<boolean>((resolve, reject) => {
		const server = net.createServer(socket => {
			socket.on('end', () => {
				console.log('PHP process disconnected')
			});
			//resolve({ reader: socket, writer: socket })
		})
		server.close();
		server.listen(0, '127.0.0.1', () => {
			const info: net.AddressInfo = JSON.parse(JSON.stringify(server.address()))
			console.log('Php Server Deso address : ' + info.address + ' port : ' + info.port + ' family : ' + info.family);
		})
	});
}