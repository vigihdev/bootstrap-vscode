import { ExtensionContext, TextDocument, Uri, languages, workspace } from "vscode";
import { Completion } from "./vs/Completion";
import { DocumentHelper } from "./vs/documentHelper";
import { FILENAME_BOOTSTRAP4, FILENAME_EXTENSION, FILENAME_YII2_ASSETS, TAG, VENDOR_DB } from "./constant";
import { commandsExtension } from "./commandsExtension";
import { getContentBootstrap4Url } from "./fs2/client";
import { ExtensionInit } from "./extensionInit";
import { readFileJson, readFiles, saveFile } from "./fs2/files";
import path = require("node:path");
import { Contexts } from "./contexts";
import { getWorkspaceFirst, updateActivateCompletion } from "./workspaceFs";
import { mixin } from "./common/objects";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const fileExt = Contexts.getExtension('dbPath') + path.sep + FILENAME_EXTENSION;
const fileBs4 = Contexts.getExtension('dbPath') + path.sep + FILENAME_BOOTSTRAP4;
const fileyii2 = Contexts.getExtension('dbPath') + path.sep + FILENAME_YII2_ASSETS;

export async function activate(context: ExtensionContext): Promise<void> {
    console.log(TAG + ' activate');
    ExtensionInit.from(context);
    commandsExtension(context);
    //updateActivateCompletion('bootstrap4')
    //console.log(getWorkspaceFirst());

    workspace.onDidOpenTextDocument((document: TextDocument) => {
        console.log('onDidOpenTextDocument');
    });

    const subscriptions = context.subscriptions;

    const provider = languages.registerCompletionItemProvider(['php', 'html'], {
        async provideCompletionItems(document, position, token, ctx) {
            const completion: Completion[] = [];
            const docs = new DocumentHelper(document, position);
            const data = readFiles(fileyii2)

            if (docs.rangeAtHtmlClass()) {
                Completion.simple(data)?.forEach(item => {
                    item.range = docs.rangeAtSpace();
                    completion.push(item);
                });
                return Promise.resolve(completion);
            }

            if (docs.rangeAtHtmlClassPhp()) {
                Completion.simple(data)?.forEach(item => {
                    item.range = docs.rangeAtSpace();
                    completion.push(item);
                });
                return Promise.resolve(completion);
            }

            return completion;
        },
    }, ' ');

    subscriptions.push(provider);
}

async function completionBsPhpHtml() {

}

async function completionBsJs() {

}