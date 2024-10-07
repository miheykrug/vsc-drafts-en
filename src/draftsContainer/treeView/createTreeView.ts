import * as vscode from "vscode";
import { existsSync } from "fs";
import { FileTreeDataProvider } from "./fileTreeDataProvider";
import { Stack } from "../../utils";
import { platform } from "os";

export function createDraftsTreeView(
  path: string,
  context: vscode.ExtensionContext,
  caches: Stack<localCache>,
  watch: boolean = true,
  firstLoading: boolean = false
) {
  const isExist = existsSync(path);
  const os = platform();
  if (!isExist) {
    if (!firstLoading) {
      vscode.window.showErrorMessage(`${path} does not exist, please select again`);
      return null;
    }
    let historyItem;
    for (let i = caches.getLength() - 1; i >= 0; i--) {
      const item = caches.stack[i];
      if (item.os === os && existsSync(item.path)) {
        historyItem = item;
        break;
      }
    }
    if (!historyItem) {
      vscode.window.showErrorMessage(`${path} does not exist, please select again`);
      return null;
    }
    path = historyItem.path;
  }
  caches.stack = caches.stack.filter((i) => i.path !== path || i.os !== os);
  caches.push({ path, os });
  context.globalState.update("qx-local-list-caches", caches.stack);
  const config = vscode.workspace.getConfiguration("qx-drafts");
  config.update("folderPath", path, true);
  const provider = new FileTreeDataProvider(path, watch);
  provider.treeView = vscode.window.createTreeView("qx-drafts", {
    treeDataProvider: provider,
    showCollapseAll: true,
  });
  return provider;
}
