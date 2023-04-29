import { ExtensionContext, TextDocument, commands, window, workspace } from "vscode";
import { updateFileWordpress, updateFileYii2 } from "./vs/fsApi";

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
			const response = await updateFileWordpress();
			if (response) {
				window.showInformationMessage('Success Update Wordpress');
			} else {
				window.showInformationMessage('Gagal Update Wordpress');
			}
		})

	);

}
