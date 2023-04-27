import { ExtensionContext, TextDocument, commands, window, workspace } from "vscode";
import { updateFileYii2 } from "./vs/fsApi";

export async function commandsExtension(context: ExtensionContext): Promise<void> {

	context.subscriptions.push(

		commands.registerCommand('Bootstrap.Yii2.Update', async () => {
			const response = await updateFileYii2();
			if (response) {
				window.showInformationMessage('Success Update Bootstrap Yii2');
			} else {
				window.showInformationMessage('Gagal Update Bootstrap Yii2');
			}
		}),

		commands.registerCommand('Bootstrap.Wordpress.Update', async () => {
			window.showInformationMessage('Test Success Update');
		})

	);

}
