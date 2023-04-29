import { ExtensionContext, Position, Range, SnippetString, TextDocument, commands, languages, window, workspace } from "vscode";
import { Completion, IEmmetCss, parseSnippet } from "./vs/Completion";
import { DocumentHelper } from "./vs/documentHelper";
import { commandsExtension } from "./commandsExtension";
import { ExtensionInit } from "./extensionInit";
import { fileNameWordpress, fileNameYii2, hasWorkspaceWordpress, hasWorkspaceYii2, isFile } from "./vs/util";
import { readFiles } from "./vs/fsApi";
import { COMMAND_EMMET_CSS_PROPERTY_SELECTED } from "./constant";

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
        case hasWorkspaceWordpress() && isFile(fileNameWordpress):
            await activateWordpress(context);
            break;
        default:
            await activateBs4(context);
    }

    await activateStylesCss(context);
    OnEmmetCssPropertySelected();
}

async function activateStylesCss(context: ExtensionContext): Promise<void> {
    const subscriptions = context.subscriptions;
    const lang = ['php', 'html', 'javascript'];
    const trigger = [' '];

    const provider = languages.registerCompletionItemProvider(lang, {
        async provideCompletionItems(document, position, token, ctx): Promise<Completion[]> {
            const completion: Completion[] = [];
            const docs = new DocumentHelper(document, position);
            if (docs.rangeAtStyles()) {
                return Promise.resolve(Completion.emmetPropCss(position));
            }

            if (docs.rangeLineAtByRegexExp(/\)\.css\(/gi, /\)/gi)) {
                return Promise.resolve(Completion.emmetPropCssWhihoutCommand());
            }

            if (docs.rangeAtCssJquery()) {
                return Promise.resolve(Completion.emmetPropCssWhihoutCommand());
            }

            return Promise.resolve(undefined);
        },
    }, ...trigger);

    subscriptions.push(provider);
}


function OnEmmetCssPropertySelected() {
    commands.registerCommand(COMMAND_EMMET_CSS_PROPERTY_SELECTED, async (textSelect: IEmmetCss, position: Position) => {
        const editor = window.activeTextEditor

        if (editor && textSelect && position) {
            if (textSelect.value) {
                const prop = textSelect.property;
                const value = textSelect.value;
                const document = editor.document;
                const range = document.getWordRangeAtPosition(position, /[a-z-A-Z-0-9-:]+\s+;/g);
                if (range) {
                    editor.insertSnippet(new SnippetString(parseSnippet(value)), new Position(position.line, range.end.character - 1))
                }
            }
        }

    });
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
            const textLine = docs.getTextLine();
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
    const subscriptions = context.subscriptions;
    const lang = ['php', 'html', 'javascript'];
    const trigger = [' '];
    const provider = languages.registerCompletionItemProvider(lang, {
        async provideCompletionItems(document, position, token, ctx): Promise<Completion[]> {
            const completion: Completion[] = [];
            const docs = new DocumentHelper(document, position);
            const textLine = docs.getTextLine();
            const fileData = readFiles(fileNameWordpress);

            if (docs.rangeAtHtmlClass()) {
                return Promise.resolve(Completion.simpleRangeSpace(fileData, document, position))
            }
            return Promise.resolve(undefined);
        },
    }, ...trigger);

    subscriptions.push(provider);
}