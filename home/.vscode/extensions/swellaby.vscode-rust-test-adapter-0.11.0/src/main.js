"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vscode = require("vscode");
const vscode_test_adapter_api_1 = require("vscode-test-adapter-api");
const vscode_test_adapter_util_1 = require("vscode-test-adapter-util");
const rust_adapter_1 = require("./rust-adapter");
const registerAdapter = (testExplorerExtension, context, adapterFactory) => {
    const testHub = testExplorerExtension.exports;
    context.subscriptions.push(new vscode_test_adapter_util_1.TestAdapterRegistrar(testHub, adapterFactory));
};
function activate(context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const workspaceFolder = (vscode.workspace.workspaceFolders || [])[0];
        const log = new vscode_test_adapter_util_1.Log('rustTestExplorer', workspaceFolder, 'Rust Explorer Log');
        context.subscriptions.push(log);
        const testExplorerExtension = vscode.extensions.getExtension(vscode_test_adapter_api_1.testExplorerExtensionId);
        if (log.enabled) {
            log.info(`Test Explorer ${testExplorerExtension ? '' : 'not '}found`);
        }
        if (testExplorerExtension) {
            const testsEmitter = new vscode.EventEmitter();
            const testStatesEmitter = new vscode.EventEmitter();
            const autorunEmitter = new vscode.EventEmitter();
            const adapterFactory = workspaceFolder => new rust_adapter_1.RustAdapter(workspaceFolder.uri.fsPath, log, testsEmitter, testStatesEmitter, autorunEmitter);
            registerAdapter(testExplorerExtension, context, adapterFactory);
        }
    });
}
exports.activate = activate;
//# sourceMappingURL=main.js.map