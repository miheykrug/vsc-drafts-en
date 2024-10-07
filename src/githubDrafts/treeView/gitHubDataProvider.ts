import * as vscode from "vscode";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import { Octokit } from "@octokit/rest";
import { GitHubFile } from "./gitHubFile";
import { name as pluginName } from "../../../package.json";

export class GitHubDataProvider implements vscode.TreeDataProvider<GitHubFile> {
  private _onDidChangeTreeData: vscode.EventEmitter<GitHubFile | undefined> =
    new vscode.EventEmitter<GitHubFile | undefined>();
  readonly onDidChangeTreeData: vscode.Event<GitHubFile | undefined> =
    this._onDidChangeTreeData.event;
  public tempPath = "";
  public treeView: vscode.TreeView<GitHubFile> | undefined;

  constructor(public github: Octokit, public config: ref<GithubConfig>) {
    this.tempPath = path.join(
      os.tmpdir(),
      pluginName,
      this.config.value!.owner,
      this.config.value!.repo
    );
  }

  async getChildren(element?: GitHubFile): Promise<GitHubFile[]> {
    const { data } = await this.github.repos.getContent({
      owner: this.config.value!.owner,
      repo: this.config.value!.repo,
      path: element?.path || "",
    });

    let files: any[] = [];
    if (Array.isArray(data)) {
      files = data;
    } else if (typeof data === "object") {
      files = [data];
    }

    const items = files.map<GitHubFile>((file: any) => {
      let type = vscode.TreeItemCollapsibleState.None;
      if (file.type === "dir") {
        type = vscode.TreeItemCollapsibleState.Collapsed;
      }
      return new GitHubFile(file.name, file.path, type);
    });

    items.sort((a, b) => {
      if (a.collapsibleState === b.collapsibleState) {
        return a.label.localeCompare(b.label);
      }
      return a.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed
        ? -1
        : 1;
    });

    if (!element) {
      const tipItem = this.createFocusRootItem("Current Repository", "qx-tip-icon");
      tipItem.description = `${this.config.value!.owner}/${
        this.config.value!.repo
      }`;
      items.unshift(tipItem);
    }

    return items;
  }

  getTreeItem(element: GitHubFile): vscode.TreeItem {
    return element;
  }

  createFocusRootItem(title: string, icon?: string): GitHubFile {
    return new GitHubFile(
      title,
      "",
      vscode.TreeItemCollapsibleState.None,
      true,
      icon
    );
  }

  async getParent(item: GitHubFile): Promise<GitHubFile | undefined> {
    if (!item.path) {
      return undefined;
    }
    const parentPath = path.dirname(item.path);
    if (parentPath === ".") {
      return undefined;
    }
    return new GitHubFile(
      "..",
      parentPath,
      vscode.TreeItemCollapsibleState.Collapsed
    );
  }

  async getContent(path: string) {
    return await this.github.repos.getContent({
      owner: this.config.value!.owner,
      repo: this.config.value!.repo,
      path: path,
    });
  }

  createTempFile(filePath: string, content: Buffer) {
    const tempFilePath = path.join(this.tempPath, filePath);
    const dir = path.dirname(tempFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(tempFilePath, content);
    return tempFilePath;
  }

  refresh() {
    this._onDidChangeTreeData.fire(undefined);
  }

  async openFile(gitPath: string) {
    const { data } = await this.getContent(gitPath);
    const content = (data as { content: string }).content;
    const encoding = (data as { encoding: string }).encoding;
    if (!content && encoding === "none") {
      vscode.window.showErrorMessage(`${gitPath} is not a text file`);
      return;
    }
    const decoded = Buffer.from(content, encoding as BufferEncoding);
    const tempFilePath = this.createTempFile(gitPath, decoded);
    vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(tempFilePath)
    );
  }

  async createOrUpdateFile(gitPath: string, content: string, create: boolean) {
    let path = gitPath.replace(/\\/g, "/");
    let sha: string | undefined;
    if (!create) {
      try {
        const { data } = await this.github.repos.getContent({
          owner: this.config.value!.owner,
          repo: this.config.value!.repo,
          path,
        });
        sha = (data as { sha: string }).sha;
        path = (data as { path: string }).path;
      } catch (error) {
        vscode.window.showErrorMessage(`${path} update failed, please save again`);
        return false;
      }
    } else {
      try {
        await this.github.repos.getContent({
          owner: this.config.value!.owner,
          repo: this.config.value!.repo,
          path,
        });
        vscode.window.showErrorMessage(`${path} already exists, creation failed`);
        return false;
      } catch (error) {}
    }
    await this.github.repos.createOrUpdateFileContents({
      owner: this.config.value!.owner,
      repo: this.config.value!.repo,
      path,
      message: "update file",
      content,
      sha,
    });
    return path;
  }

  async deleteFile(gitPath: string) {
    const { data } = await this.github.repos.getContent({
      owner: this.config.value!.owner,
      repo: this.config.value!.repo,
      path: gitPath,
    });
    if (Array.isArray(data)) {
      for (const file of data) {
        await this.deleteFile(file.path);
      }
    } else {
      const sha = (data as { sha: string }).sha;
      await this.github.repos.deleteFile({
        owner: this.config.value!.owner,
        repo: this.config.value!.repo,
        path: gitPath,
        message: "delete file",
        sha,
      });
    }
  }

  async rename(gitPath: string, newName: string) {}

  async findItem(gitPath: string) {
    const queue: GitHubFile[] = [];
    const rootItems = await this.getChildren();
    queue.push(...rootItems);
    while (queue.length > 0) {
      const item = queue.shift();
      if (item) {
        if (item.path === gitPath) {
          return item;
        }
        const children = await this.getChildren(item);
        queue.push(...children);
      }
    }
    return undefined;
  }

  async revealItem(gitPath: string) {
    const item = await this.findItem(gitPath);
    if (item) {
      await this.treeView?.reveal(item, {
        select: true,
        focus: true,
        expand: true,
      });
    }
  }

  getRepoUrl() {
    const owner = this.config.value?.owner;
    const repo = this.config.value?.repo;
    if (!owner || !repo) {
      return "";
    }
    return `https://github.com/${owner}/${repo}`;
  }

  clearCache() {
    if (fs.existsSync(this.tempPath)) {
      fs.rmdirSync(this.tempPath, { recursive: true });
    }
  }

  clearAllCache() {
    const tempPath = path.join(os.tmpdir(), pluginName);
    if (fs.existsSync(tempPath)) {
      fs.rmdirSync(tempPath, { recursive: true });
    }
  }
}
