"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
var gzip = require("gzip-js");
function changeText(f) {
    if (!vscode.window.activeTextEditor) {
        // If no open document, do nothing
        return;
    }
    let e = vscode.window.activeTextEditor;
    let d = e.document;
    let sel = e.selections;
    e.edit(function (edit) {
        // iterate through the selections
        for (var x = 0; x < sel.length; x++) {
            let txt = d.getText(new vscode.Range(sel[x].start, sel[x].end));
            try {
                edit.replace(sel[x], f(txt));
            }
            catch (e) {
                console.log(e);
            }
        }
    });
}
function gunzipB64(txt) {
    if (!isBase64(txt)) {
        throw new Error("Selected text is not base64.");
    }
    let b64d = new Buffer(txt, "base64");
    let unzipped = gzip.unzip(b64d);
    let unzippedBuffer = new Buffer(unzipped);
    return unzippedBuffer.toString();
}
function isBase64(txt) {
    return Buffer.from(txt, "base64").toString("base64") === txt;
}
function base64d(txt) {
    if (!isBase64(txt)) {
        throw new Error("Selected text is not base64.");
    }
    return new Buffer(txt, "base64").toString();
}
function GunzipBase64() {
    changeText(gunzipB64);
}
exports.GunzipBase64 = GunzipBase64;
function GzipBase64() {
    changeText(txt => {
        let zipped = gzip.zip(txt);
        let zippedBuffer = new Buffer(zipped);
        return zippedBuffer.toString("base64");
    });
}
exports.GzipBase64 = GzipBase64;
function Base64() {
    changeText(txt => new Buffer(txt).toString("base64"));
}
exports.Base64 = Base64;
function Base64D() {
    changeText(base64d);
}
exports.Base64D = Base64D;
function OpenInNewTab() {
    if (!vscode.window.activeTextEditor) {
        // If no open document, do nothing
        return;
    }
    let e = vscode.window.activeTextEditor;
    let d = e.document;
    let sel = e.selections;
    for (var x = 0; x < sel.length; x++) {
        let txt = d
            .getText(new vscode.Range(sel[x].start, sel[x].end))
            .trim();
        try {
            txt = gunzipB64(txt);
        }
        catch (e) {
            console.log("Not a Gzip Base64 text.");
        }
        try {
            txt = base64d(txt);
        }
        catch (e) {
            console.log("Not a Base64 text.");
        }
        let options = {};
        try {
            txt = JSON.stringify(JSON.parse(txt), null, 2);
            options.language = 'json';
        }
        catch (e) {
            console.log("Not a JSON.");
        }
        options.content = txt;
        vscode.workspace
            .openTextDocument(options)
            .then(doc => vscode.window.showTextDocument(doc, { preview: false }));
    }
}
exports.OpenInNewTab = OpenInNewTab;
//# sourceMappingURL=commands.js.map