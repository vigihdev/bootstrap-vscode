import { ExtensionContext, TextDocument, commands, window, workspace } from "vscode";
import * as fs from "fs";
import path = require("path");

export async function commandsExtension(context: ExtensionContext): Promise<void> {

	context.subscriptions.push(
		commands.registerCommand('Bootstrap.Yii2.Update', async () => {
			window.showInformationMessage('Test Success Update');
			// console.log(context);
			// console.log(workspace.workspaceFolders);
			// console.log(workspace.textDocuments);
		})
	);

}
