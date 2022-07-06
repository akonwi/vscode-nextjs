import * as vscode from "vscode";
import * as path from "path";

const KEYWORDS = [
  { label: "Get Server Side Props", pattern: "getServerSideProps" },
  { label: "Get Static Props", pattern: "getStaticProps" },
  { label: "Get Static Paths", pattern: "getStaticPaths" },
  { label: "Page Component", pattern: "export default" },
  { label: "Middlware Config", pattern: "export const config" },
];

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

    const children: Entry[] = [];

    await Promise.all(
      KEYWORDS.map(({ label, pattern }) => {
        return vscode.workspace.findTextInFiles(
          {
            pattern,
            isCaseSensitive: true,
            isWordMatch: true,
          },
          {
            include: path.relative(
              this.workspaceRoot,
              activeTextEditor.document.fileName
            ),
          },
          (result) => children.push(new Entry(label, result))
        );
      })
    );

    return children;
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
