const vscode = require('vscode');


function getStateInfo (line) {
  
}

const react = vscode.commands.registerCommand('extension.react', function () {
  // The code you place here will be executed every time your command is executed

  const { window, workspace } = vscode;

  window.showInformationMessage('Hello World react!');

  workspace.textDocuments.forEach(file => {
      if (file.languageId === 'javascript') {
          const { WorkspaceEdit, Position, Uri } = vscode;
          const edit = new WorkspaceEdit();
          const uri = Uri.file(file.fileName);
          const documentData = window.activeTextEditor.document;
          const stateInfo = [];
          let isState = false;
          let numInsertedLines = 0;

          for (let i = 0; i < documentData.lineCount; i++){
              const line = documentData.lineAt(i).text;
              if (line.includes('state = {')) { // Specifically targets 'this.state'
                isState = true;
              } else if (isState) {
                const currentStateInfo = getStateInfo(line);
                stateInfo.push(currentStateInfo);
                if (!line.includes('{') && line.includes('}')) { // Best practices would have the '}' on a separate line
                  isState = false;
                }
                numInsertedLines++;
              } else if (line.includes('render')) {
                
              }
              
          }
          workspace.applyEdit(edit);
      }
  })
});

const idle = vscode.commands.registerCommand('extension.idle', function () {
  console.log('idle!');
});

module.exports = {react, idle}