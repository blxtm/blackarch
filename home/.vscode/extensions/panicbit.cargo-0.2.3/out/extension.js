'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const cargo = require("./cargo");
const util = require("./util");
const util_1 = require("./util");
const config = require("./config");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const rust_diagnostics = vscode.languages.createDiagnosticCollection("rust");
        context.subscriptions.push(rust_diagnostics);
        vscode.workspace.onDidSaveTextDocument((document) => {
            if (config.automaticCheck()) {
                vscode.commands.executeCommand("cargo.check");
            }
        });
        context.subscriptions.push(vscode.commands.registerCommand('cargo.check', () => __awaiter(this, void 0, void 0, function* () { return with_cargo_diagnostics(rust_diagnostics, 'cargo check', cargo.check); })));
        context.subscriptions.push(vscode.commands.registerCommand('cargo.build', () => __awaiter(this, void 0, void 0, function* () { return with_cargo_diagnostics(rust_diagnostics, 'cargo build', cargo.build); })));
        context.subscriptions.push(vscode.commands.registerCommand('cargo.add', () => __awaiter(this, void 0, void 0, function* () {
            let cwd = util.getCwd();
            let input = yield vscode.window.showInputBox();
            if (input === undefined) {
                return;
            }
            let packages = yield cargo.search(input);
            let items = packages.map((pkg) => ({
                label: pkg.name,
                detail: `All-time DLs: ${pkg.downloads} Recent DLs: ${pkg.recent_downloads}`,
                description: `(${pkg.max_version}) ${pkg.description}`,
            }));
            let selection = yield vscode.window.showQuickPick(items);
            if (selection === undefined) {
                return;
            }
            let name = selection.label;
            console.log(`Adding dependency '${name}'`);
            yield cargo.add(cwd, name).catch(util_1.logAndShowError);
            vscode.window.showInformationMessage(`Successfully added dependency '${name}'`);
            if (config.automaticCheck()) {
                vscode.commands.executeCommand("cargo.check");
            }
        })));
        context.subscriptions.push(vscode.commands.registerCommand('cargo.rm', () => __awaiter(this, void 0, void 0, function* () {
            let cwd = util.getCwd();
            let name = yield vscode.window.showInputBox();
            if (name === undefined) {
                return;
            }
            console.log(`Removing dependency '${name}'`);
            yield cargo.rm(cwd, name).catch(util_1.logAndShowError);
            vscode.window.showInformationMessage(`Successfully removed dependency '${name}'`);
            if (config.automaticCheck()) {
                vscode.commands.executeCommand("cargo.check");
            }
        })));
        if (config.automaticCheck()) {
            vscode.commands.executeCommand("cargo.check");
        }
    });
}
exports.activate = activate;
function with_cargo_diagnostics(rust_diagnostics, name, command) {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = util.getCwd();
        rust_diagnostics.clear();
        let diagnosis = new Diagnosis;
        let progressOptions = { location: vscode.ProgressLocation.Window };
        yield vscode.window.withProgress(progressOptions, (progress) => __awaiter(this, void 0, void 0, function* () {
            progress.report({ message: "Running 'cargo metadata'" });
            let metadata = yield cargo.metadata(cwd);
            let workspaceRoot = metadata.workspace_root;
            progress.report({ message: `Running '${name}'` });
            let diagnostics = yield command(cwd);
            progress.report({ message: "Processing build messages" });
            diagnosis.add_cargo_diagnostics(workspaceRoot, diagnostics);
            diagnosis.finish(rust_diagnostics);
        }));
    });
}
class Diagnosis {
    constructor() {
        this.diagnostics = new Map();
    }
    add(path, diagnostic) {
        if (!this.diagnostics.has(path)) {
            this.diagnostics.set(path, []);
        }
        let diagnostics = this.diagnostics.get(path);
        let alreadyExisting = diagnostics.find((other) => diagnostic.code == other.code
            && diagnostic.message == other.message
            && diagnostic.range.isEqual(other.range)
            && diagnostic.severity == other.severity
            && diagnostic.source == diagnostic.source);
        if (!alreadyExisting) {
            diagnostics.push(diagnostic);
        }
    }
    add_cargo_diagnostics(workspaceRoot, diagnostics) {
        diagnostics
            .filter((diag) => diag.message !== undefined)
            .map((diag) => diag)
            .forEach((diag) => {
            diag.message.spans.forEach((span) => {
                console.log(diag);
                let range = new vscode.Range(span.line_start - 1, span.column_start - 1, span.line_end - 1, span.column_end - 1);
                this.add_cargo_message(workspaceRoot, range, span, diag.message);
            });
        });
    }
    add_cargo_message(workspaceRoot, range, span, message) {
        var level = (() => {
            switch (message.level) {
                case cargo.Level.Error: return vscode.DiagnosticSeverity.Error;
                case cargo.Level.Note: return vscode.DiagnosticSeverity.Information;
                case cargo.Level.Help: return vscode.DiagnosticSeverity.Hint;
                case cargo.Level.Warning: return vscode.DiagnosticSeverity.Warning;
                default: return vscode.DiagnosticSeverity.Error;
            }
        })();
        let formatted_message = `${message.level}: ${message.message}`;
        if (span.label) {
            formatted_message += `\nlabel: ${span.label}`;
        }
        let diagnostic = new vscode.Diagnostic(range, formatted_message, level);
        let file_path = path.join(workspaceRoot, span.file_name);
        this.add(file_path, diagnostic);
        for (let child of message.children) {
            this.add_cargo_message(workspaceRoot, range, span, child);
        }
    }
    finish(diagnostics) {
        for (let [path, file_diagnostic] of this.diagnostics.entries()) {
            const uri = vscode.Uri.file(path);
            diagnostics.set(uri, file_diagnostic);
        }
    }
}
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map