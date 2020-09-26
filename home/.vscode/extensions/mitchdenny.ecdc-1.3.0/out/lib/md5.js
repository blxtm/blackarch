"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
class StringToMD5Transformer {
    get label() {
        return `String to MD5 Hash (${this.digestMethodDescription})`;
    }
    get description() {
        return this.label;
    }
    check(input) {
        return true;
    }
    transform(input) {
        let hash = crypto.createHash('md5');
        hash.update(input, 'utf8');
        let output = hash.digest(this.digestMethod);
        return output;
    }
}
class StringToMD5Base64Transformer extends StringToMD5Transformer {
    get digestMethodDescription() {
        return "as Base64";
    }
    get digestMethod() {
        return "base64";
    }
}
exports.StringToMD5Base64Transformer = StringToMD5Base64Transformer;
class StringToMD5HexTransformer extends StringToMD5Transformer {
    get digestMethodDescription() {
        return "as Hex";
    }
    get digestMethod() {
        return "hex";
    }
}
exports.StringToMD5HexTransformer = StringToMD5HexTransformer;
//# sourceMappingURL=md5.js.map