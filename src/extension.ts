import { ExtensionContext, languages } from "vscode";
import { initializeFileCss } from "./api/fsApi";
import { bootstrapActive } from "./fixtures/bootstrapActive";
import { stylesCssActive } from "./fixtures/stylesCssActive";
import { bootstrapDataAttribues } from "./fixtures/bootstrapDataAttribues";

export async function activate(context: ExtensionContext): Promise<void> {
    const initialize = await initializeFileCss();
    const bootstrap = await bootstrapActive(context);
    const style = await stylesCssActive(context);
    const bootstrapdata = await bootstrapDataAttribues(context);
}