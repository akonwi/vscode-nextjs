import * as vscode from "vscode";
import * as path from "path";

export class NextJsSymbolProvider implements vscode.TreeDataProvider<Entry> {
  private _onDidChangeTreeData: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();

  readonly onDidChangeTreeData: vscode.Event<void> =
    this._onDidChangeTreeData.event;

  constructor(private workspaceRoot = "") {}

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Entry): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  async getChildren(element?: Entry): Promise<Entry[]> {
    const activeTextEditor = vscode.window.activeTextEditor;

    if (this.workspaceRoot === "" || activeTextEditor == null) {
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

    return results.map((r) => new Entry("getServerSideProps", r));
  }
}

class Entry extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    searchResult: vscode.TextSearchResult
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.command = {
      title: "Go to",
      command: "vscode.open",
      arguments: [
        searchResult.uri,
        { selection: (searchResult as any).ranges[0] },
      ],
    };
  }
}
