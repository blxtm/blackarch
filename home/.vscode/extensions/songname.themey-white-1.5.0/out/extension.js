'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const themeGenerator = require("./themeGenerator");
function promptToReloadWindow() {
    const action = 'Reload';
    vscode.window
        .showInformationMessage(`Reload window to see updated theme. Make sure to have the 'Themey' theme selected.`, action)
        .then(selectedAction => {
        if (selectedAction === action) {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
    });
}
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.runThemey', () => {
        let inputOpts = {
            placeHolder: 'Specify location of image',
            prompt: 'Specify location of image',
            ignoreFocusOut: true
        };
        vscode.window.showInputBox(inputOpts).then((imageUrl) => {
            if (!imageUrl || imageUrl === '') {
                return;
            }
            let location = path.join(__dirname, '..', 'themes', 'themey.json');
            themeGenerator.generateThemesFromImage(imageUrl.trim(), location, (err, message) => {
                if (err) {
                    vscode.window.showInformationMessage("Error getting palette from image. Make sure the path is correct.");
                }
                else {
                    promptToReloadWindow();
                }
            });
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map