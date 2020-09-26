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
const util_1 = require("./util");
const node_fetch_1 = require("node-fetch");
const json_stream_1 = require("json-stream");
var Level;
(function (Level) {
    Level["Error"] = "error";
    Level["Help"] = "help";
    Level["Note"] = "note";
    Level["Warning"] = "warning";
})(Level = exports.Level || (exports.Level = {}));
function metadata(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        let output = yield util_1.exec('cargo', ['metadata', '--no-deps', '--format-version=1'], { cwd });
        if (output.code !== 0) {
            throw new Error(`cargo build: ${output.stderr}`);
        }
        return JSON.parse(output.stdout);
    });
}
exports.metadata = metadata;
function build(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        let output = yield util_1.exec('cargo', ['build', '--message-format=json'], { cwd });
        if (output.code !== 0 && output.stdout === "") {
            throw new Error(`cargo build: ${output.stderr}`);
        }
        return json_stream_1.parse_json_stream(output.stdout);
    });
}
exports.build = build;
function check(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        let output = yield util_1.exec('cargo', ['check', '--message-format=json', '--all-targets'], { cwd });
        if (output.code !== 0 && output.stdout === "") {
            throw new Error(`cargo check: ${output.stderr}`);
        }
        return json_stream_1.parse_json_stream(output.stdout);
    });
}
exports.check = check;
function add(cwd, pkg) {
    return __awaiter(this, void 0, void 0, function* () {
        let { code, stderr } = yield util_1.exec('cargo', ['add', '--', pkg], { cwd });
        if (code !== 0) {
            console.error(stderr);
            throw Error("`cargo add` returned with non-zero exit code");
        }
    });
}
exports.add = add;
function rm(cwd, pkg) {
    return __awaiter(this, void 0, void 0, function* () {
        let { code, stderr } = yield util_1.exec('cargo', ['rm', '--', pkg], { cwd });
        if (code !== 0) {
            console.error(stderr);
            throw Error("`cargo rm` returned with non-zero exit code");
        }
    });
}
exports.rm = rm;
function search(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield node_fetch_1.default(`https://crates.io/api/v1/crates?per_page=20&q=${name}`);
        let json = yield response.json();
        return json.crates;
    });
}
exports.search = search;
//# sourceMappingURL=cargo.js.map