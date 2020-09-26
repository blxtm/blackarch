"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var entities = require('entities');
class XmlEntitiesToStringTransformer {
    get label() {
        return 'XML Entities to String';
    }
    get description() {
        return this.label;
    }
    check(input) {
        return true;
    }
    transform(input) {
        let output = entities.decodeXML(input);
        return output;
    }
}
exports.XmlEntitiesToStringTransformer = XmlEntitiesToStringTransformer;
class StringToXmlEntitiesTransformer {
    get label() {
        return 'String to XML Entities';
    }
    get description() {
        return this.label;
    }
    check(input) {
        return true;
    }
    transform(input) {
        let output = entities.encodeXML(input);
        return output;
    }
}
exports.StringToXmlEntitiesTransformer = StringToXmlEntitiesTransformer;
//# sourceMappingURL=xmlentities.js.map