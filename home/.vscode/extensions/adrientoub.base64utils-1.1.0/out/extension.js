"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const commands_1 = require("./commands");
function activate(context) {
    console.log("Extension Base64Utils launched.");
    context.subscriptions.push(vscode.commands.registerCommand("extension.Base64", commands_1.Base64), vscode.commands.registerCommand("extension.Base64D", commands_1.Base64D), vscode.commands.registerCommand("extension.GzipBase64", commands_1.GzipBase64), vscode.commands.registerCommand("extension.GunzipBase64", commands_1.GunzipBase64), vscode.commands.registerCommand("extension.OpenInNewTab", commands_1.OpenInNewTab));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map