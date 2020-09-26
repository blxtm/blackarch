'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const node_category_1 = require("./enums/node-category");
exports.createEmptyTestSuiteNode = (id, cargoPackage, isStructuralNode = false, testCategory = node_category_1.NodeCategory.unit, testSpecName = '') => {
    const packageName = cargoPackage ? cargoPackage.name : undefined;
    return {
        id,
        testSpecName,
        childrenNodeIds: [],
        packageName,
        isStructuralNode,
        category: testCategory,
        targets: []
    };
};
exports.createTestCaseNode = (id, packageName, nodeTarget, nodeIdPrefix, testSpecName = '') => {
    return {
        id,
        packageName,
        nodeTarget,
        testSpecName,
        nodeIdPrefix
    };
};
exports.createTestSuiteInfo = (id, label) => {
    return {
        id,
        label,
        type: 'suite',
        children: []
    };
};
exports.createTestInfo = (id, label) => {
    return {
        id,
        label,
        type: 'test'
    };
};
//# sourceMappingURL=utils.js.map