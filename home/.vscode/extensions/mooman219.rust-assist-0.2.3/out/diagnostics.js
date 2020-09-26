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
const util = require("./util");
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
var Level;
(function (Level) {
    Level["Error"] = "error";
    Level["Help"] = "help";
    Level["Note"] = "note";
    Level["Warning"] = "warning";
})(Level || (Level = {}));
function parseMessageLevel(level) {
    switch (level) {
        case Level.Error: return vscode.DiagnosticSeverity.Error;
        case Level.Note: return vscode.DiagnosticSeverity.Information;
        case Level.Help: return vscode.DiagnosticSeverity.Hint;
        case Level.Warning: return vscode.DiagnosticSeverity.Warning;
        default: return vscode.DiagnosticSeverity.Error;
    }
}
function parseSpanRange(span) {
    return new vscode.Range(span.line_start - 1, span.column_start - 1, span.line_end - 1, span.column_end - 1);
}
function parseStdout(stdout) {
    let messages = [];
    let seen = new Set();
    for (const line of stdout.split("\n")) {
        // Remove duplicate lines. Running '--all-targets' can generate
        // duplicate errors.
        if (!line || seen.has(line)) {
            continue;
        }
        seen.add(line);
        // Parse the message into a diagnostic.
        let diag = JSON.parse(line);
        if (diag.message !== undefined) {
            messages.push(diag.message);
        }
    }
    return messages;
}
/**
 * Parses a message into diagnostics.
 *
 * @param bucket The array to store parsed diagnostics in.
 * @param msg The message to parse.
 * @param rootPath The root path of the rust project the message was generated
 * for.
 */
function parseMessage(bucket, msg, rootPath) {
    // Parse all valid spans.
    for (const span of msg.spans) {
        let level = parseMessageLevel(msg.level);
        if (!span.is_primary) {
            level = vscode.DiagnosticSeverity.Information;
        }
        let message = msg.message;
        if (msg.code) {
            message = `[${msg.code.code}] ${message}.`;
        }
        if (span.label) {
            message = `${message} \n[Note] ${span.label}`;
        }
        let range = parseSpanRange(span);
        let diagnostic = new vscode.Diagnostic(range, message, level);
        let file_path = path.join(rootPath, span.file_name);
        bucket.push({ file_path: file_path, diagnostic: diagnostic });
    }
    // Recursively parse child messages.
    for (const child of msg.children) {
        parseMessage(bucket, child, rootPath);
    }
}
/**
 * Removes rust's metadata in the specified project folder. This is a work
 * around for `cargo check` not reissuing warning information for libs.
 *
 * @param rootPath The root path of a rust project.
 */
function removeDiagnosticMetadata(rootPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let pattern = new vscode.RelativePattern(path.join(rootPath, 'target', 'debug'), '*.rmeta');
        let files = (yield vscode.workspace.findFiles(pattern));
        for (const file of files) {
            yield fs.unlink(file.fsPath, error => {
                if (error !== null) {
                    console.warn('Unlink failed', error);
                }
            });
        }
    });
}
/**
 * Queries for the diagnostics of a rust project.
 *
 * @param rootPath The root path of a rust project.
 * @returns An array of diagnostics for the given rust project.
 */
function queryDiagnostics(rootPath) {
    return __awaiter(this, void 0, void 0, function* () {
        // FIXME: Workaround for warning generation for libs.
        yield removeDiagnosticMetadata(rootPath);
        const output = yield util.spawn('cargo', ['check', '--all-targets', '--message-format=json'], { cwd: rootPath });
        let diagnostics = [];
        for (const messages of parseStdout(output.stdout)) {
            parseMessage(diagnostics, messages, rootPath);
        }
        return diagnostics;
    });
}
// ========================================================
// Diagnostic Management
// ========================================================
function hasPrerequisites() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield util.spawn('cargo', [`--version`]);
            return true;
        }
        catch (error) {
            return false;
        }
    });
}
exports.hasPrerequisites = hasPrerequisites;
class DiagnosticsManager {
    constructor(projectList, target) {
        this.pending = new Map();
        this.projectList = projectList;
        this.target = target;
    }
    refreshAll() {
        return __awaiter(this, void 0, void 0, function* () {
            vscode.window.setStatusBarMessage('Running cargo check...');
            this.pending.clear();
            for (const project of this.projectList.projects) {
                this.addAll(yield queryDiagnostics(project.path));
            }
            this.render();
            vscode.window.setStatusBarMessage('');
        });
    }
    render() {
        this.target.clear();
        for (let [path, file_diagnostic] of this.pending.entries()) {
            const uri = vscode.Uri.file(path);
            this.target.set(uri, file_diagnostic);
        }
    }
    addAll(diagnostic) {
        for (const diag of diagnostic) {
            this.add(diag);
        }
    }
    add(diagnostic) {
        let set = this.pending.get(diagnostic.file_path);
        if (set !== undefined) {
            set.push(diagnostic.diagnostic);
        }
        else {
            this.pending.set(diagnostic.file_path, [diagnostic.diagnostic]);
        }
    }
}
exports.DiagnosticsManager = DiagnosticsManager;
//# sourceMappingURL=diagnostics.js.map