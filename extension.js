// T:re the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');


function findFunctionName (line) {
    const FUNCTION_LENGTH = 8;
    const functionNamePosition = line.search('function') + FUNCTION_LENGTH;

    line = line.substr(functionNamePosition);
    const wordArray = line.split('(');
    return wordArray[0].trim();
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
                let functionName = '';
                let numInsertedLines = 0;

                console.log('document is', documentData.getText());

                for (let i = 0; i < documentData.lineCount; i++){
                    const line = documentData.lineAt(i).text;
                    if (startOfFunction){

                        const startColumn = line.search(/[^ ]/);

                        edit.insert(uri, new Position(i, startColumn), `console.log('${functionName} line ${i + 1 + numInsertedLines}');\n${" ".repeat(startColumn)}`);
                        startOfFunction = false;
                        numInsertedLines++;
                    }
                    if (line.includes('function')){
                        functionName = findFunctionName(line);
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
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
