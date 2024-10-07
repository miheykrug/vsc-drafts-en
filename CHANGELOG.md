# Changelog
Update logs for each version

## [0.2.8] - 2024-05-15

- Added draft notebook history switch record. When the current draft notebook does not exist, it will automatically open the first draft notebook in the history record that exists in the current system. This is convenient for remote development on Windows, avoiding frequent path not found pop-ups.

## [0.2.7] - 2024-05-06

- Fixed the issue where non-cached files would still attempt to upload when crossing drive letters.

## [0.2.6] - 2024-05-01

- Optimized Remote experience.

## [0.2.5] - 2024-04-28

- Fixed the issue of duplicate prompts in the draft list.

## [0.2.4] - 2024-04-27

- Remote drafts now support opening and saving Notebook files, such as .ipynb files.
- Added a feature to clear local cache of remote drafts.
- Added a button to open the GitHub repository in the browser.
- Fixed some known issues.

## [0.2.3] - 2024-04-24

- Optimized code structure.
- Draft list now supports saving GitHub remote draft notebooks.
- Optimized UI and added prompt messages.

## [0.2.2] - 2024-04-23

- Added GitHub remote draft notebook feature.
- Optimized prompt messages and added error prompts.
- Optimized code logic.
- Replaced some icons.

## [0.2.1] - 2024-04-22

- Recorded changelog of previous versions.
- Reorganized README.

## [0.2.0] - 2024-04-22

- Renamed the plugin to "Drafts Scratch", added the scratch keyword, making it more recognizable to IDEA users.

## [0.1.4] - 2024-04-22

- Modified the prompt for convenient operations in the root directory.

## [0.1.3] - 2024-04-21

- Fixed the issue where openExternal could not recognize and open paths with non-ASCII characters.

## [0.1.2] - 2024-04-21

- After creating a file, the tree view will expand the folder and focus on the file.
- Used built-in openExternal instead of spawn child process, making opening the system file explorer faster.
- Optimized code logic and removed redundant code.

## [0.1.1] - 2024-04-21

- Added draft notebook list, supporting bookmarking the current draft notebook and real-time hot switching.
- Optimized project folder structure, with separate commends and treeView folders for different features.

## [0.1.0] - 2024-04-20

- Optimized code logic and performance, updated view UI configuration.
- Added the feature to open a new VSCode window.

## [0.0.1] - 2024-04-20

- Completed basic functions, supporting opening a folder and displaying the file structure using a tree view.
- Basic file operations: create, delete, rename, open in terminal, open in system file explorer.
