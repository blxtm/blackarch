"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function config() {
    return vscode.workspace.getConfiguration('cargo');
}
function automaticCheck() {
    return config().get("automaticCheck") === true;
}
exports.automaticCheck = automaticCheck;
//# sourceMappingURL=config.js.map