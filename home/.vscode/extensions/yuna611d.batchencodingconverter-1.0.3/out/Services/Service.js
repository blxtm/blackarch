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
const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");
class Service {
    constructor(encodingPair) {
        this.encodingPair = encodingPair;
    }
    convertEncoding(fpPair) {
        return __awaiter(this, void 0, void 0, function* () {
            if (fpPair) {
                yield this.convertEncodingForOneFile(fpPair);
            }
            else {
                this.convertEncodingForAllFiles();
            }
        });
    }
    convertEncodingForAllFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine Base and output Directory
            const baseDir = this.getBaseDir();
            const outputDir = path.join(baseDir, "_" + this.encodingPair.distEncoding);
            // Create OutputDir
            this.createOutputDir(outputDir);
            // Seek files
            const files = fs.readdirSync(baseDir);
            // Get filePath -> filter files -> convert encoding            
            const fpPairs = files.map(file => {
                return {
                    SrcFp: path.join(baseDir, file),
                    DistFp: path.join(outputDir, file)
                };
            })
                .filter(fpPair => {
                return fs.statSync(fpPair.SrcFp).isFile();
            });
            yield Promise.all(fpPairs.map((fpPair) => __awaiter(this, void 0, void 0, function* () {
                return yield this.convertEncoding(fpPair);
            })));
        });
    }
    convertEncodingForOneFile(fpPair) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check binary or not
            yield fs.createReadStream(fpPair.SrcFp, { end: 512 })
                .on('data', data => {
                if (this.seemsBinary(data)) {
                    throw new Error(`${fpPair.SrcFp} seems binary`);
                }
            })
                .on('close', () => __awaiter(this, void 0, void 0, function* () {
                // Read file -> convert encoding -> write file
                yield fs.createReadStream(fpPair.SrcFp)
                    .pipe(iconv.decodeStream(this.encodingPair.srcEncoding))
                    .pipe(iconv.encodeStream(this.encodingPair.distEncoding))
                    .pipe(fs.createWriteStream(fpPair.DistFp));
            }));
        });
    }
    getBaseDir() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error("Missing workspace");
        }
        return workspaceFolders[0].uri.fsPath;
    }
    createOutputDir(outputDir) {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
    }
    seemsBinary(buffer) {
        const controls = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        for (let i = 0; i < 512; i++) {
            const c = buffer[i];
            if (controls.indexOf(c) > -1) {
                return true;
            }
        }
        return false;
    }
}
exports.Service = Service;
var Encoding;
(function (Encoding) {
    Encoding["Shift_JIS"] = "Shift_JIS";
    Encoding["UTF8"] = "UTF-8";
})(Encoding = exports.Encoding || (exports.Encoding = {}));
//# sourceMappingURL=Service.js.map