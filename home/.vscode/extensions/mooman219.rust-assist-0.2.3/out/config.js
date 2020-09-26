"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function config() {
    return vscode.workspace.getConfiguration('rust-assist');
}
function diagnosticsOnStartup() {
    return config().get('diagnosticsOnStartup', true);
}
exports.diagnosticsOnStartup = diagnosticsOnStartup;
function diagnosticsOnSave() {
    return config().get('diagnosticsOnSave', true);
}
exports.diagnosticsOnSave = diagnosticsOnSave;
function formatOnSave() {
    return config().get('formatOnSave', false);
}
exports.formatOnSave = formatOnSave;
var FormatMode;
(function (FormatMode) {
    FormatMode["Backup"] = "backup";
    FormatMode["Overwrite"] = "overwrite";
})(FormatMode = exports.FormatMode || (exports.FormatMode = {}));
function formatMode() {
    return config().get('formatMode', FormatMode.Overwrite);
}
exports.formatMode = formatMode;
//# sourceMappingURL=config.js.map