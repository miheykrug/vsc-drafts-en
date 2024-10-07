import * as vscode from "vscode";

export class FileItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly resourceUri?: vscode.Uri,
    public readonly root?: boolean,
    public readonly icon?: string
  ) {
    super(label, collapsibleState);
    if (root) {
      this.iconPath = new vscode.ThemeIcon(icon || 'root-item-icon');
      this.contextValue = "rootItem";
      this.description = "To avoid some bugs, convenient operations for the root directory are provided here";
      return;
    }
    if (collapsibleState === vscode.TreeItemCollapsibleState.None) {
      this.command = {
        command: "vscode.open",
        title: "Open File",
        arguments: [this.resourceUri],
      };
      this.iconPath = new vscode.ThemeIcon(icon || "file");
      this.contextValue = "file";
    } else {
      this.iconPath = new vscode.ThemeIcon(icon || "folder");
      this.contextValue = "folder";
    }
  }
}
