import * as vscode from "vscode";
import { FileTreeDataProvider } from "../treeView/fileTreeDataProvider";
import { FileItem } from "../treeView/fileItem";
import * as path from "path";
import { spawn } from "child_process";

export function createOpenInExplorer(provider: ref<FileTreeDataProvider>) {
  return vscode.commands.registerCommand(
    "qx-drafts.openInExplorer",
    async (fileItem: FileItem | undefined) => {
      if (!fileItem?.resourceUri) {
        explorer(provider.value?.getRootPath() || "");
        return;
      }
      let folderPath = fileItem.resourceUri.fsPath;
      if (fileItem.contextValue === "file") {
        folderPath = path.dirname(folderPath);
      }
      explorer(folderPath);
    }
  );
}

function explorer(folderPath: string) {
  if (!folderPath) {
    return;
  }
  if (containsNonAscii(folderPath)) {
    try {
      switch (process.platform) {
        case "darwin":
          spawn("open", [folderPath]);
          break;
        case "win32":
          spawn("explorer", [folderPath]);
          break;
        default:
          spawn("xdg-open", [folderPath]);
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    vscode.env.openExternal(vscode.Uri.file(folderPath));
  }
}

function containsNonAscii(str: string) {
  return /[^\x00-\x7F]/.test(str);
}
