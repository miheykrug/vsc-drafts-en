import * as vscode from "vscode";
import { DraftItem } from "./DraftItem";

export class DraftsTreeDataProvider
  implements vscode.TreeDataProvider<DraftItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<DraftItem | undefined> =
    new vscode.EventEmitter<DraftItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<DraftItem | undefined> =
    this._onDidChangeTreeData.event;

  public treeView: vscode.TreeView<DraftItem> | undefined;

  constructor(private context: vscode.ExtensionContext) {}

  getTreeItem(element: DraftItem): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(element.name);
    treeItem.description = element.path;
    if (element.root) {
      treeItem.iconPath = new vscode.ThemeIcon("qx-tip-icon");
      treeItem.contextValue = "rootItem";
      return treeItem;
    }
    if (element.path.startsWith("GitHub:")) {
      const infoArr = element.path.split(":")[1].split("/");
      const config: GithubConfig = {
        owner: infoArr[0],
        repo: infoArr[1],
        token: "",
      };
      treeItem.command = {
        command: "qx-drafts-github.showTreeView",
        title: "Open GitHub Draft Notebook",
        arguments: [config],
      };
    } else {
      treeItem.command = {
        command: "qx-drafts.showFileTree",
        title: "Open Draft Notebook",
        arguments: [element.path],
      };
    }
    return treeItem;
  }

  getChildren(element?: DraftItem): Thenable<DraftItem[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      return Promise.resolve(this.getDraftFolders());
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getDraftFolders(): DraftItem[] {
    const drafts = this.context.globalState
      .get<DraftItem[]>("qx-draftFolders", [])
      .filter((item) => {
        return !item.root;
      });
    drafts.unshift(
      this.createFocusRootItem(
        "Notice",
        "After switching the remote repository, modifications to other repository files will no longer be tracked and synchronized. Please save before switching."
      )
    );
    return drafts;
  }

  addDraftFolder(item: DraftItem) {
    const findDraft = this.findDraft(item);
    if (findDraft.index !== -1) {
      vscode.window.showErrorMessage(
        `${findDraft.draft.name}: ${findDraft.draft.path} Draft notebook already exists, name or path cannot be duplicated.`
      );
      return;
    }
    const draftFolders = this.getDraftFolders();
    draftFolders.push(item);
    this.context.globalState.update("qx-draftFolders", draftFolders);
    this.refresh();
  }

  findDraft(item: DraftItem) {
    const draftFolders = this.getDraftFolders();
    const index = draftFolders.findIndex(
      (i) => i.name === item.name || i.path === item.path
    );
    return {
      index,
      draft: draftFolders[index],
    };
  }

  deleteDraftFolder(item: DraftItem) {
    const draftFolders = this.getDraftFolders();
    const index = this.findDraft(item).index;
    if (index !== -1) {
      draftFolders.splice(index, 1);
      this.context.globalState.update("qx-draftFolders", draftFolders);
      this.refresh();
    }
  }

  renameDraftFolder(item: DraftItem, newName: string) {
    const draftFolders = this.getDraftFolders();
    const index = this.findDraft(item).index;
    if (index !== -1) {
      draftFolders[index].name = newName;
      this.context.globalState.update("qx-draftFolders", draftFolders);
      this.refresh();
    }
  }

  createFocusRootItem(title: string, describe: string): DraftItem {
    return new DraftItem(title, describe, true);
  }
}
