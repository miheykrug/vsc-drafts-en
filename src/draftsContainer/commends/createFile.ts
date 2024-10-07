import * as vscode from "vscode";
import { FileTreeDataProvider } from "../treeView/fileTreeDataProvider";
import { FileItem } from "../treeView/fileItem";
import * as path from "path";

export function createCreateFile(provider: ref<FileTreeDataProvider>) {
  return vscode.commands.registerCommand(
    "qx-drafts.createFile",
    async (fileItem: FileItem | undefined) => {
      if (!provider.value) {
        return;
      }
      let newPath;
      if (fileItem?.resourceUri) {
        newPath = fileItem.resourceUri.fsPath;
        if (fileItem.contextValue === "file") {
          newPath = path.dirname(newPath);
        }
      } else {
        newPath = provider.value.getRootPath();
      }
      if (!newPath) {
        return;
      }
      const fileName = await vscode.window.showInputBox({
        prompt: "Please enter the file name",
        placeHolder: `Create a new file in ${
          path.relative(provider.value.getRootPath(), newPath) || "root directory"
        }`,
      });
      if (!fileName) {
        return;
      }
      const filePath = path.normalize(path.join(newPath, fileName));
      const fileUri = vscode.Uri.file(filePath);
      try {
        await vscode.workspace.fs.stat(fileUri);
        vscode.window.showErrorMessage(`${filePath} already exists, creation failed`);
        return;
      } catch (error) {}
      await vscode.workspace.fs.writeFile(fileUri, new Uint8Array());
      provider.value?.refresh();
      await vscode.window.showTextDocument(
        await vscode.workspace.openTextDocument(fileUri)
      );
      await provider.value?.revealItem(fileUri);
    }
  );
}
