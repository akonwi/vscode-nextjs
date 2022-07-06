// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { NextJsSymbolProvider } from "./tree-data-provider";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  const nextJsSymbolProvider = new NextJsSymbolProvider(rootPath);

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider("nextJsLib", nextJsSymbolProvider)
  );

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((_textEditor) =>
      nextJsSymbolProvider.refresh()
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
