'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
var ignoredLanguages;
// let orange = vscode.window.createOutputChannel("Orange")
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "autoend" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let configuration = vscode.workspace.getConfiguration('autoend');
    let autoInsertNewline = configuration.get('autoInsertNewline');
    let autoendWithColon = configuration.get('autoendWithColon');
    ignoredLanguages = new Set();
    // configuration.get<Array<string>>('ignoredLanguages').forEach(element => {
    //     ignoredLanguages.add(element);
    // });
    // orange.appendLine("start");
    if (autoInsertNewline == null || autoInsertNewline == undefined)
        autoInsertNewline = true;
    if (autoendWithColon == null || autoendWithColon == undefined)
        autoendWithColon == false;
    if (autoendWithColon == true) {
        let colonDisposable = vscode.commands.registerCommand('extension.colon.autoend', () => {
            FireColonOrSemiColonCommand(vscode.window.activeTextEditor, autoInsertNewline, ':');
        });
        let semicolonDisposable = vscode.commands.registerCommand('extension.autoend', () => {
            // IgnoreAndPutCharacterInCurrentPostion(vscode.window.activeTextEditor, ';')
            FireColonOrSemiColonCommand(vscode.window.activeTextEditor, autoInsertNewline, ';');
        });
        context.subscriptions.push(colonDisposable);
        context.subscriptions.push(semicolonDisposable);
    }
    else {
        let semicolonDisposable = vscode.commands.registerCommand('extension.autoend', () => {
            FireColonOrSemiColonCommand(vscode.window.activeTextEditor, autoInsertNewline, ';');
        });
        let colonDisposable = vscode.commands.registerCommand('extension.colon.autoend', () => {
            IgnoreAndPutCharacterInCurrentPostion(vscode.window.activeTextEditor, ':');
        });
        context.subscriptions.push(colonDisposable);
        context.subscriptions.push(semicolonDisposable);
    }
}
exports.activate = activate;
function FireColonOrSemiColonCommand(editor, autoInsertNewline, character) {
    // orange.appendLine('FireColonOrSemiColonCommand');
    let document = editor.document;
    // Check ignores
    if (ignoredLanguages.has(document.languageId)) {
        IgnoreAndPutCharacterInCurrentPostion(editor, character);
        return;
    }
    let lineNumber = editor.selection.active.line;
    let columnNumber = editor.selection.active.character;
    let lineText = editor.document.lineAt(lineNumber).text;
    let lineLength = lineText.length;
    ;
    let trimmedText = lineText.replace(/\s+/g, " ").trim();
    // orange.appendLine(autoInsertNewline || "no line");
    if (OkToPutSemiColonInCurrentPosition(trimmedText, lineNumber, columnNumber)) {
        IgnoreAndPutCharacterInCurrentPostion(editor, character);
    }
    else {
        editor.edit(textEditor => {
            textEditor.insert(new vscode.Position(lineNumber, lineLength), character);
        });
        if (autoInsertNewline)
            vscode.commands.executeCommand('editor.action.insertLineAfter');
        else
            vscode.commands.executeCommand('cursorEnd');
    }
}
function IgnoreAndPutCharacterInCurrentPostion(editor, character) {
    // orange.appendLine('IgnoreAndPutCharacterInCurrentPostion')
    let lineNumber = editor.selection.active.line;
    let columnNumber = editor.selection.active.character;
    let lineText = editor.document.lineAt(lineNumber).text;
    let lineLength = lineText.length;
    let trimmedText = lineText.replace(/\s+/g, " ").trim();
    editor.edit((textEditor) => {
        textEditor.insert(new vscode.Position(lineNumber, columnNumber), character);
    });
}
function OkToPutSemiColonInCurrentPosition(trimmedText, lineNumber, columnNumber) {
    var textIsALoop = trimmedText.startsWith('for(') | trimmedText.startsWith('foreach(')
        | trimmedText.startsWith('for (') | trimmedText.startsWith('foreach (');
    var textIsAComment = trimmedText.startsWith("//");
    var alreadyEndsWithSemiColon = trimmedText.endsWith(';');
    return textIsALoop || textIsAComment || alreadyEndsWithSemiColon;
}
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map