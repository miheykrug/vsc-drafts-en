import * as vscode from "vscode";

export class GitHubFile extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly path: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly root: boolean = false,
    public readonly icon?: string
  ) {
    super(label, collapsibleState);
    if (root) {
      this.iconPath = new vscode.ThemeIcon(icon || "root-item-icon");
      this.contextValue = "rootItem";
      this.description = "To avoid some bugs, convenient operations for the root directory are provided here";
      return;
    }
    if (collapsibleState === vscode.TreeItemCollapsibleState.None) {
      this.iconPath = new vscode.ThemeIcon(icon || "file");
      this.contextValue = "file";
      this.command = {
        command: "qx-drafts-github.openFile",
        title: "Open File",
        arguments: [this],
      };
    } else {
      this.iconPath = new vscode.ThemeIcon(icon || "folder");
      this.contextValue = "folder";
    }
  }
}
