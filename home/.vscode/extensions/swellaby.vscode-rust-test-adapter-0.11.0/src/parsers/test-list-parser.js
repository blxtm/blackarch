'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const node_category_1 = require("../enums/node-category");
exports.updateTestTree = (testNode, targetRootNode, modulePathParts, testModulesMap, associatedPackage, nodeTarget) => {
    let currentNode = targetRootNode;
    let testSpecName = '';
    // This is easier to grok inline than it would be if it were split across multiple functions
    // eslint-disable-next-line max-statements
    modulePathParts.forEach(part => {
        testSpecName += `${part}::`;
        const parentNodeId = currentNode.id;
        const currentNodeId = `${parentNodeId}::${part}`;
        let suiteNode = testModulesMap.get(currentNodeId);
        let suiteInfo = currentNode.children.find(c => c.id === currentNodeId);
        if (!suiteNode) {
            suiteNode = utils_1.createEmptyTestSuiteNode(currentNodeId, associatedPackage, false, node_category_1.NodeCategory.unit, testSpecName);
            suiteNode.targets.push(nodeTarget);
            suiteInfo = utils_1.createTestSuiteInfo(currentNodeId, part);
            testModulesMap.set(currentNodeId, suiteNode);
            if (!currentNode.children.some(c => c.id === currentNodeId)) {
                currentNode.children.push(suiteInfo);
            }
        }
        currentNode = suiteInfo;
    });
    currentNode.children.push(testNode);
};
exports.initializeTestNode = (trimmedModulePathParts, testName, nodeIdPrefix, cargoPackage, testCasesMap, nodeTarget) => {
    const testNodeId = `${nodeIdPrefix}::${trimmedModulePathParts}`;
    const testNode = utils_1.createTestCaseNode(testNodeId, cargoPackage.name, nodeTarget, nodeIdPrefix, trimmedModulePathParts);
    const testInfo = utils_1.createTestInfo(testNodeId, testName);
    testCasesMap.set(testNodeId, testNode);
    return testInfo;
};
exports.parseCargoTestListOutput = (cargoTestListResult, nodeIdPrefix, cargoPackage, testCasesMap, targetSuiteInfo, testSuitesMap) => {
    const testsOutput = cargoTestListResult.output.split('\n\n')[0];
    testsOutput.split('\n').forEach(testLine => {
        const trimmedModulePathParts = testLine.split(': test')[0];
        const modulePathParts = trimmedModulePathParts.split('::');
        const testName = modulePathParts.pop();
        const testNode = exports.initializeTestNode(trimmedModulePathParts, testName, nodeIdPrefix, cargoPackage, testCasesMap, cargoTestListResult.nodeTarget);
        exports.updateTestTree(testNode, targetSuiteInfo, modulePathParts, testSuitesMap, cargoPackage, cargoTestListResult.nodeTarget);
    });
};
exports.parseCargoTestListResult = (cargoTestListResult, packageName, cargoPackage, packageRootNode, testSuitesMap, packageSuiteInfo, testCasesMap) => {
    const target = cargoTestListResult.nodeTarget;
    const targetName = target.targetName;
    const targetType = target.targetType;
    const targetNodeId = `${packageName}::${targetName}::${targetType}`;
    const targetRootNode = utils_1.createEmptyTestSuiteNode(targetNodeId, cargoPackage);
    packageRootNode.childrenNodeIds.push(targetNodeId);
    packageRootNode.targets.push(target);
    targetRootNode.targets.push(target);
    testSuitesMap.set(targetNodeId, targetRootNode);
    const targetSuiteInfo = utils_1.createTestSuiteInfo(targetNodeId, targetName);
    packageSuiteInfo.children.push(targetSuiteInfo);
    exports.parseCargoTestListOutput(cargoTestListResult, targetNodeId, cargoPackage, testCasesMap, targetSuiteInfo, testSuitesMap);
};
/**
 * Parses the cargo test list results to create the tree of tests.
 *
 * @param {ICargoPackage} cargoPackage - The cargo package.
 * @param {ICargoTestListResult[]} cargoTestListResults - The resulting lists of cargo tests for the specified package.
 *
 * @returns {ILoadedTestsResult}
 */
// tslint:disable-next-line:max-func-body-length
exports.parseCargoTestListResults = (cargoPackage, cargoTestListResults) => {
    if (!cargoPackage || !cargoTestListResults || cargoTestListResults.length === 0) {
        return undefined;
    }
    const { name: packageName } = cargoPackage;
    const packageRootNode = utils_1.createEmptyTestSuiteNode(packageName, cargoPackage);
    const packageSuiteInfo = utils_1.createTestSuiteInfo(packageName, packageName);
    const testSuitesMap = new Map();
    testSuitesMap.set(packageName, packageRootNode);
    const testCasesMap = new Map();
    cargoTestListResults.forEach(cargoTestListResult => {
        if (!cargoTestListResult) {
            return;
        }
        const { output } = cargoTestListResult;
        if (output.startsWith('0 tests,') || output.indexOf('\n0 tests,') >= 0) {
            return;
        }
        exports.parseCargoTestListResult(cargoTestListResult, packageName, cargoPackage, packageRootNode, testSuitesMap, packageSuiteInfo, testCasesMap);
    });
    if (packageSuiteInfo.children.length === 1) {
        packageSuiteInfo.children = packageSuiteInfo.children[0].children;
    }
    return {
        rootTestSuite: packageSuiteInfo,
        testCasesMap,
        testSuitesMap
    };
};
//# sourceMappingURL=test-list-parser.js.map