"use strict";
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
const vscode_1 = require("vscode");
class SymbolEntry {
    constructor() { }
    static fromDocumentSymbol(symbol, parentSymbol) {
        const markdownString = new vscode_1.MarkdownString('$(symbol-method) ' + symbol.name);
        const entry = new SymbolEntry();
        entry.label = markdownString.value;
        entry.description = parentSymbol ? parentSymbol.name : '';
        entry.range = symbol.range;
        return entry;
    }
    static fromLabel(label) {
        const entry = new SymbolEntry();
        entry.label = label;
        return entry;
    }
}
class GoToMethodProvider {
    initialise(context) {
        context.subscriptions.push(vscode_1.commands.registerCommand('workbench.action.gotoMethod', () => this.showQuickView()));
        this.decorationType = vscode_1.window.createTextEditorDecorationType({
            isWholeLine: true,
            backgroundColor: new vscode_1.ThemeColor('editor.rangeHighlightBackground')
        });
        context.subscriptions.push(this.decorationType);
    }
    getSymbols(document) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield vscode_1.commands.executeCommand('vscode.executeDocumentSymbolProvider', document.uri);
            return result || [];
        });
    }
    showQuickView() {
        return __awaiter(this, void 0, void 0, function* () {
            const activeTextEditor = vscode_1.window.activeTextEditor;
            if (!activeTextEditor) {
                return;
            }
            const symbolEntries = this.getSymbols(activeTextEditor.document)
                .then(syms => {
                if (syms.length === 0) {
                    return [SymbolEntry.fromLabel('No symbols found')];
                }
                const newSymbols = [];
                const addSymbols = (symbols, parentSymbol) => {
                    for (const sym of symbols.filter(symbol => symbol.kind === vscode_1.SymbolKind.Method ||
                        symbol.kind === vscode_1.SymbolKind.Function ||
                        symbol.kind === vscode_1.SymbolKind.Constructor)) {
                        newSymbols.push(SymbolEntry.fromDocumentSymbol(sym, parentSymbol));
                    }
                };
                addSymbols(syms);
                for (const sym of syms) {
                    addSymbols(sym.children, sym);
                }
                return newSymbols;
            });
            const currentRange = activeTextEditor.visibleRanges.length > 0
                ? activeTextEditor.visibleRanges[0]
                : new vscode_1.Range(0, 0, 0, 0);
            const pickedItem = yield vscode_1.window.showQuickPick(symbolEntries, {
                onDidSelectItem: (selectedItem) => {
                    if (!selectedItem.range) {
                        return;
                    }
                    activeTextEditor.setDecorations(this.decorationType, [selectedItem.range]);
                    activeTextEditor.revealRange(selectedItem.range, vscode_1.TextEditorRevealType.Default);
                }
            });
            activeTextEditor.setDecorations(this.decorationType, []);
            if (pickedItem && pickedItem.range) {
                const range = pickedItem.range;
                activeTextEditor.revealRange(range, vscode_1.TextEditorRevealType.Default);
                activeTextEditor.selection = new vscode_1.Selection(range.start, range.start);
            }
            else {
                activeTextEditor.revealRange(currentRange, vscode_1.TextEditorRevealType.Default);
            }
        });
    }
}
exports.GoToMethodProvider = GoToMethodProvider;
//# sourceMappingURL=goToMethod.js.map