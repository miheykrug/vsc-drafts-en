# Drafts
> Saw this post [Looking for a vscode extension](https://www.v2ex.com/t/1033986) while surfing on V2EX, it was indeed a good idea, so this plugin was created.

Choose a local folder or GitHub repository as a drafts notebook, then you can easily manage your drafts, just like the built-in file explorer.

No need to open an extra window for your `"test"` folder (temporary files, code drafts) anymore. Similar to IDEA's **Scratches** feature.

For **BUG** reports and **suggestions**, please go to [Issues](https://github.com/qxchuckle/vsc-drafts/issues) for discussion.

## Installation
VSCode Marketplace: [Drafts Scratch](https://marketplace.visualstudio.com/items?itemName=qcqx.qx-drafts)

## Introduction
Use **tree view** to display the structure of the drafts notebook, just like the built-in file explorer.
1. Supported operations: open, create, delete, rename, open in terminal, open in system file explorer, open in new window.
2. Drafts list: You can save (bookmark) the current drafts notebook and support quick switching.

![image](https://github.com/qxchuckle/vsc-drafts/assets/55614189/057aec64-cd1d-412f-b585-7b31142d2d32)

### Drafts List
You can save frequently used local or remote drafts notebooks and support quick switching.

![image](https://github.com/qxchuckle/vsc-drafts/assets/55614189/40f0ec9e-8f18-4471-9fbb-01cde0b768f8)

> Note: After switching to another GitHub remote drafts notebook, modifications to other remote drafts notebook files will no longer be tracked and synchronized until you select another remote drafts notebook again. So please save data and synchronize before switching to another remote drafts notebook to avoid data loss.

### GitHub Remote Drafts Notebook
From version 0.2.2, it supports selecting a GitHub repository as a remote drafts notebook. Some drafts that need **multi-end synchronization** can use this feature.

You need to create a repository on GitHub in advance, then click **Initialize and Select**, and fill in the GitHub username, Token, and repository name in sequence.

![image](https://github.com/qxchuckle/vsc-drafts/assets/55614189/e4a1efe7-dfb3-4f48-857d-19d91fb504e3)

> This feature has only been tested on Windows. If there are compatibility issues on other platforms, please go to [Issues](https://github.com/qxchuckle/vsc-drafts/issues) to report them.

## TODO
None

## Development
Clone this project:

```bash
git clone git@github.com:qxchuckle/vsc-drafts.git
cd vsc-drafts
npm install
```

Project structure:

```
├───📁 resource # Static resources
├───📁 src # Project source code
│   ├───📁 utils # Utility library
│   ├───📁 [Feature Name] # Different features
│   │   └─── 📁 commends # Commands for this feature
│   │   └─── 📁 treeView # Tree view for this feature
|   |   └─── 📁 ...... # Other sub-items for this feature
|   |   └─── 📄 index.ts Entry point for the feature, contains initialization function
│   └───📄 extension.ts # Plugin entry file
├───📁 types # Type definitions
└───📄 ......
```
