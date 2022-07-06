import * as vscode from "vscode";
import * as path from "path";

export class NextJsSymbolProvider implements vscode.TreeDataProvider<Entry> {
  constructor(private workspaceRoot = "") {}

  getTreeItem(element: Entry): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  async getChildren(element?: Entry): Promise<Entry[]> {
    console.log("getting children");
    const activeTextEditor = vscode.window.activeTextEditor;

    if (this.workspaceRoot === "" || activeTextEditor == undefined) {
      return [];
    }

    const results: vscode.TextSearchResult[] = [];
    await vscode.workspace.findTextInFiles(
      {
        pattern: "getServerSideProps",
        isCaseSensitive: true,
        isWordMatch: true,
      },
      {
        include: path.relative(
          this.workspaceRoot,
          activeTextEditor.document.fileName
        ),
      },
      (result) => results.push(result)
    );

    console.log("results", results);
    return results.map((r) => new Entry("getServerSideProps"));
  }
}

class Entry extends vscode.TreeItem {
  constructor(public readonly label: string) {
    super(label, vscode.TreeItemCollapsibleState.Collapsed);
    this.tooltip = this.label;
  }

  iconPath = {
    light: path.join(
      __filename,
      "..",
      "..",
      "resources",
      "light",
      "dependency.svg"
    ),
    dark: path.join(
      __filename,
      "..",
      "..",
      "resources",
      "dark",
      "dependency.svg"
    ),
  };
}
