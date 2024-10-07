import * as vscode from "vscode";
import { existsSync } from "fs";
import { FileTreeDataProvider } from "../treeView/fileTreeDataProvider";
import { createDraftsTreeView } from "../treeView/createTreeView";
import { Stack } from "../../utils";

export function createShowFileTree(
  provider: ref<FileTreeDataProvider>,
  watch: boolean = true,
  context: vscode.ExtensionContext,
  caches: Stack<localCache>
) {
  return vscode.commands.registerCommand(
    "qx-drafts.showFileTree",
    async (path?: string) => {
      if (path) {
        const isExist = existsSync(path);
        if (!isExist) {
          vscode.window.showErrorMessage(`${path} does not exist, please select again`);
          return;
        }
        if (path === provider.value?.getRootPath()) {
          return;
        }
        provider.value = createDraftsTreeView(path, context, caches, watch);
        return;
      }
      let draftsPath;
      const rootPath = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: "Select Folder",
      });
      if (rootPath && rootPath.length > 0) {
        draftsPath = rootPath[0].fsPath;
      }
      if (draftsPath) {
        provider.value = createDraftsTreeView(
          draftsPath,
          context,
          caches,
          watch
        );
      }
    }
  );
}
