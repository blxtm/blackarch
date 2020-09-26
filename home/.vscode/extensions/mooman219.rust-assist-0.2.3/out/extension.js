'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const config = require("./config");
const util = require("./util");
const diagnostics = require("./diagnostics");
const format = require("./format");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // Startup
        const projects = yield util.findProjects();
        if (!projects.hasProjects()) {
            vscode.window.showWarningMessage('Rust Assist: No `Cargo.toml` files were found in the workspace, unable to start plugin.');
            return;
        }
        // Prerequisites checks
        const canDiagnostics = yield diagnostics.hasPrerequisites();
        const canFormat = yield format.hasPrerequisites();
        if (!canDiagnostics) {
            vscode.window.showWarningMessage('Rust Assist: Cargo not found on path, code diagnostics are disabled.');
        }
        if (!canFormat) {
            vscode.window.showWarningMessage('Rust Assist: Rustfmt not found on path, formatting is disabled.');
        }
        // Managers
        const diagnosticManager = new diagnostics.DiagnosticsManager(projects, vscode.languages.createDiagnosticCollection("rust"));
        const formatManager = new format.FormatManager(config.formatMode());
        // Event registration
        if (canDiagnostics) {
            // Diagnostics on command
            context.subscriptions.push(vscode.commands.registerCommand('rust-assist.refreshDiagnostics', () => __awaiter(this, void 0, void 0, function* () {
                diagnosticManager.refreshAll();
            })));
            // Diagnostics on startup
            if (config.diagnosticsOnStartup()) {
                diagnosticManager.refreshAll();
            }
        }
        // On save logic
        if (canDiagnostics || canFormat) {
            context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((document) => __awaiter(this, void 0, void 0, function* () {
                if (document.languageId === 'rust') {
                    // Formatting on save
                    if (canFormat && config.formatOnSave()) {
                        yield formatManager.formatFile(projects.getParent(document.uri.fsPath), document.uri.fsPath);
                    }
                    // Diagnostics on save
                    if (canDiagnostics && config.diagnosticsOnSave()) {
                        diagnosticManager.refreshAll();
                    }
                }
            })));
        }
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map