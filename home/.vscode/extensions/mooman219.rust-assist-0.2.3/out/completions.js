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
const vscode = require("vscode");
const tmp = require("tmp");
// Get sysroot rustc --print sysroot
// ========================================================
// Completion Management
// ========================================================
function hasPrerequisites() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield util.spawn('racer', [`--version`]);
            return true;
        }
        catch (error) {
            return false;
        }
    });
}
exports.hasPrerequisites = hasPrerequisites;
class CompletionManager {
    constructor() {
        tmp.setGracefulCleanup();
        let file = tmp.fileSync();
        this.tmpFile = file.name;
    }
    getDocumentFilter() {
        return { language: 'rust', scheme: 'file' };
    }
    getDefinitionProvider() {
        return { provideDefinition: this.definitionProvider.bind(this) };
    }
    definitionProvider(document, position) {
        const args = ['find-definition', (position.line + 1).toString(), position.character.toString(), document.fileName, this.tmpFile];
        return util.spawn('racer', args).then(output => {
            console.log(output.stdout);
            const lines = output.stdout.split('\n');
            if (lines.length === 0) {
                return undefined;
            }
            const result = lines[0];
            const parts = result.split('\t');
            const line = Number(parts[2]) - 1;
            const character = Number(parts[3]);
            const uri = vscode.Uri.file(parts[4]);
            return new vscode.Location(uri, new vscode.Position(line, character));
        });
    }
}
exports.CompletionManager = CompletionManager;
//# sourceMappingURL=completions.js.map