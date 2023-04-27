import { ExtensionContext, TextDocument, Uri, languages, workspace } from "vscode";
import { Completion } from "./vs/Completion";
import { DocumentHelper } from "./vs/documentHelper";
import { commandsExtension } from "./commandsExtension";
import { ExtensionInit } from "./extensionInit";
import { fileNameYii2, hasWorkspaceYii2, isFile } from "./vs/util";
import { readFiles } from "./vs/fsApi";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function activate(context: ExtensionContext): Promise<void> {
    //console.log(' activate');
    ExtensionInit.from(context);
    commandsExtension(context);

    workspace.onDidOpenTextDocument((document: TextDocument) => { });
    switch (true) {
        case hasWorkspaceYii2() && isFile(fileNameYii2):
            await activateYii2(context);
            break;
        default:
            await activateBs4(context);
    }
}

async function activateBs4(context: ExtensionContext): Promise<void> {
    const subscriptions = context.subscriptions;
    const lang = ['php', 'html', 'javascript'];
    const trigger = [' '];
    const provider = languages.registerCompletionItemProvider(lang, {
        async provideCompletionItems(document, position, token, ctx): Promise<Completion[]> {
            const completion: Completion[] = [];
            const docs = new DocumentHelper(document, position);
            if (docs.rangeAtHtmlClass()) {
            }

            if (docs.rangeAtHtmlClassPhp()) {
            }

            return Promise.resolve(undefined);
        },
    }, ...trigger);

    subscriptions.push(provider);
}

async function activateYii2(context: ExtensionContext): Promise<void> {

    const subscriptions = context.subscriptions;
    const lang = ['php', 'html', 'javascript'];
    const trigger = [' '];
    const provider = languages.registerCompletionItemProvider(lang, {
        async provideCompletionItems(document, position, token, ctx): Promise<Completion[]> {
            const completion: Completion[] = [];
            const docs = new DocumentHelper(document, position);
            const fileData = readFiles(fileNameYii2);

            if (docs.rangeAtHtmlClass()) {
                return Promise.resolve(Completion.simpleRangeSpace(fileData, document, position))
            }

            if (docs.rangeAtHtmlClassPhp()) {
                return Promise.resolve(Completion.simpleRangeSpace(fileData, document, position))
            }

            return Promise.resolve(undefined);
        },
    }, ...trigger);

    subscriptions.push(provider);
}

async function activateWordpress(context: ExtensionContext): Promise<void> {

}