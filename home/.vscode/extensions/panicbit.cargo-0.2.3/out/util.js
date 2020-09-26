"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const process = require("child_process");
function logAndShowError(error) {
    console.error(error);
    vscode.window.showErrorMessage(error.message);
    throw error;
}
exports.logAndShowError = logAndShowError;
function exec(cmd, args, options) {
    return new Promise((resolve, reject) => {
        let stdout = "";
        let stderr = "";
        const proc = process.spawn(cmd, args, options);
        proc.stdout.on('data', (data) => stdout += data);
        proc.stderr.on('data', (data) => stderr += data);
        proc.on('close', (code) => resolve({ stdout, stderr, code }));
        proc.on('error', (err) => reject(err));
    });
}
exports.exec = exec;
function getCwd() {
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
        vscode.window.showErrorMessage("No open files");
        throw Error("No open files");
    }
    const cwd = path.dirname(editor.document.uri.fsPath);
    return cwd;
}
exports.getCwd = getCwd;
//# sourceMappingURL=util.js.map