"use strict";
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
const config_1 = require("./config");
const vscode = require("vscode");
// ========================================================
// Format Management
// ========================================================
function hasPrerequisites() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield util.spawn('rustfmt', [`--version`]);
            return true;
        }
        catch (error) {
            return false;
        }
    });
}
exports.hasPrerequisites = hasPrerequisites;
class FormatManager {
    constructor(formatMode) {
        this.formatMode = formatMode;
    }
    formatFile(project, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (project !== undefined) {
                let args = [];
                if (yield project.hasRootFile('rustfmt.toml')) {
                    args.push(`--config-path=${project.path}`);
                }
                if (this.formatMode === config_1.FormatMode.Backup) {
                    args.push('--backup');
                }
                args.push(filePath);
                const result = yield util.spawn('rustfmt', args, { cwd: project.path });
                if (result.stderr) {
                    vscode.window.showErrorMessage(`Rust Assist: Format error. ${result.stderr}`);
                }
            }
            else {
                vscode.window.showErrorMessage('Rust Assist: Unable to find root path for file, unable to format.');
            }
        });
    }
}
exports.FormatManager = FormatManager;
//# sourceMappingURL=format.js.map