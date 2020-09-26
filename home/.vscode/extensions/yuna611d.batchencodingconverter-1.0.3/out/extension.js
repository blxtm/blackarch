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
const ServiceProvider_1 = require("./Providers/ServiceProvider");
function activate(context) {
    // Convert to UTF8
    context.subscriptions.push(disposableAction('extension.convertSjisToUTF8', ServiceProvider_1.ServiceType.SJIStoUTF8, { FinishMessage: 'Saved all files as UTF8' }));
    // Convert to SJIS
    context.subscriptions.push(disposableAction('extension.convertUTF8ToSjis', ServiceProvider_1.ServiceType.UTF8toSJIS, { FinishMessage: 'Saved all files as SJIS' }));
    /**
     * Return register command, which has main action
     * @param command
     * @param message
     */
    function disposableAction(command, serviceType, message) {
        return vscode.commands.registerCommand(command, () => __awaiter(this, void 0, void 0, function* () {
            // StartMessage
            showMessage(message.StartMessage);
            // Main Action
            const service = new ServiceProvider_1.ServiceProvider().provide(serviceType);
            yield service.convertEncoding();
            // FinishMessage
            showMessage(message.FinishMessage);
        }));
    }
    /**
     * Show InformationMessage if message exist.
     * @param message
     */
    function showMessage(message) {
        if (message) {
            vscode.window.showInformationMessage(message);
        }
    }
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map