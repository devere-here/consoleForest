// T:re the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { react, idle } = require('./react');


function getFunctionInfo (line) {
    const FUNCTION_LENGTH = 8;
    const functionNamePosition = line.search('function') + FUNCTION_LENGTH;
    const substring = line.substr(functionNamePosition).trim();
    const wordArray = substring.split(/[ (),]/);
    const functionInfo = {};

    functionInfo.functionName = wordArray[0];
    functionInfo.params = [];

    for (let i = 1; i < wordArray.length; i++){
        if (wordArray[i] === '{') break;
        else if (wordArray[i] !== '') functionInfo.params.push(wordArray[i])
    }
    return functionInfo;
};

function createConsoleString (functionInfo, i, numInsertedLines) {
    const { functionName, params } = functionInfo;

    let str = `'${functionName} line ${i + 1 + numInsertedLines}'`;

    params.forEach(param => {
        str += `, '${param}', ${param}`;
    })

    return str;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "console forest" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json


    let forest = vscode.commands.registerCommand('extension.forest', function () {
        // The code you place here will be executed every time your command is executed

        const { window, workspace } = vscode;

        window.showInformationMessage('Hello World fool!');

        workspace.textDocuments.forEach(file => {
            if (file.languageId === 'javascript') {
                const { WorkspaceEdit, Position, Uri } = vscode;
                const edit = new WorkspaceEdit();
                const uri = Uri.file(file.fileName);
                const documentData = window.activeTextEditor.document;
                let startOfFunction = false;
                let functionInfo;
                let numInsertedLines = 0;

                for (let i = 0; i < documentData.lineCount; i++){
                    const line = documentData.lineAt(i).text;
                    if (startOfFunction){
                        const startColumn = line.search(/[^ ]/);
                        const consoleStr = createConsoleString(functionInfo, i, numInsertedLines);

                        edit.insert(uri, new Position(i, startColumn), `console.log(${consoleStr});\n${" ".repeat(startColumn)}`);

                        startOfFunction = false;
                        numInsertedLines++;
                    }
                    if (line.includes('function')){
                        functionInfo = getFunctionInfo(line);
                        startOfFunction = true;
                    }
                }
                workspace.applyEdit(edit);
            }
        })
    });

    let deforest = vscode.commands.registerCommand('extension.deforest', function () {
        console.log('deforestation!');
    });

    context.subscriptions.push(forest);
    context.subscriptions.push(deforest);
    context.subscriptions.push(react);
    context.subscriptions.push(idle);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
