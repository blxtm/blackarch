'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cargo_1 = require("./cargo");
const test_list_parser_1 = require("./parsers/test-list-parser");
const utils_1 = require("./utils");
const node_category_1 = require("./enums/node-category");
exports.buildRootNodeInfo = (testSuiteNodes, rootNodeId, rootNodeLabel) => {
    const rootTestSuiteNode = utils_1.createEmptyTestSuiteNode(rootNodeId, null, true, node_category_1.NodeCategory.structural);
    const rootTestInfo = utils_1.createTestSuiteInfo(rootNodeId, rootNodeLabel);
    rootTestInfo.children = testSuiteNodes.length === 1
        ? testSuiteNodes[0].children
        : rootTestInfo.children = testSuiteNodes;
    rootTestSuiteNode.childrenNodeIds = rootTestInfo.children.map(c => c.id);
    return { testSuiteInfo: rootTestInfo, testSuiteNode: rootTestSuiteNode };
};
exports.loadPackageUnitTestTree = (cargoPackage, log) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const cargoTestListResults = yield cargo_1.getCargoUnitTestListForPackage(cargoPackage, log);
            resolve(test_list_parser_1.parseCargoTestListResults(cargoPackage, cargoTestListResults));
        }
        catch (err) {
            const baseErrorMessage = `Fatal error while attempting to load unit tests for package: ${cargoPackage.name}`;
            log.debug(`${baseErrorMessage}. Details: ${err}`);
            reject(err);
        }
    }));
});
/**
 * Loads the specified types of tests for the packages using the provided loader function.
 *
 * @param {ICargoPackage[]} packages - The cargo packages in the workspace.
 * @param {Log} log - The logger.
 * @param loadTestTypeTreeForPackage
 *
 * @private - Only exposed for unit testing purposes
 * @returns {Promise<ILoadedTestsResult[]>}
 */
exports.loadTestsForPackages = (packages, log, loadTestTypeTreeForPackage) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const packageTests = yield Promise.all(packages.map((p) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const packageTestResult = yield loadTestTypeTreeForPackage(p, log);
        if (!packageTestResult) {
            return undefined;
        }
        return packageTestResult;
    })));
    return packageTests.filter(Boolean);
});
/**
 * Loads the unit tests.
 *
 * @param {ICargoPackage[]} packages - The packages to load tests from.
 * @param {Log} log - The logger.
 *
 * @private - Only exposed for unit testing purposes
 * @returns {Promise<ITestTypeLoadedTestsResult>}
 */
exports.loadUnitTests = (packages, log) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const results = yield exports.loadTestsForPackages(packages, log, exports.loadPackageUnitTestTree);
    if (!results || results.length === 0) {
        return null;
    }
    const { testSuiteInfo: rootNode, testSuiteNode } = exports.buildRootNodeInfo(results.map(r => r.rootTestSuite), 'unit', 'unit');
    return { rootNode, results, testSuiteNode };
});
/**
 * Loads the documentation tests.
 *
 * @param {ICargoPackage[]} packages - The packages to load tests from.
 * @param {Log} log - The logger.
 *
 * @private - Only exposed for unit testing purposes
 * @returns {Promise<ITestTypeLoadedTestsResult>}
 */
exports.loadDocumentationTests = (_packages, _log) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return Promise.reject(new Error('Not yet implemented.'));
});
/**
 * Loads the integration tests.
 *
 * @param {ICargoPackage[]} packages - The packages to load tests from.
 * @param {Log} log - The logger.
 *
 * @private - Only exposed for unit testing purposes
 * @returns {Promise<ITestTypeLoadedTestsResult>}
 */
exports.loadIntegrationTests = (_packages, _log) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return Promise.reject(new Error('Not yet implemented.'));
});
/**
 * Aggregates all the various loaded tests into the final resulting object.
 *
 * @param {ITestTypeLoadedTestsResult[]} workspaceTestResults - The collection of loaded tests for the workspace.
 *
 * @private - Only exposed for unit testing purposes
 * @returns {ILoadedTestsResult}
 */
exports.aggregateWorkspaceTestsResults = (workspaceTestResults) => {
    let testSuitesMap = new Map();
    const testSuitesMapIterators = [];
    const testCasesMapIterators = [];
    const rootTestInfoNodes = [];
    workspaceTestResults.forEach(result => {
        rootTestInfoNodes.push(result.rootNode);
        testSuitesMap.set(result.testSuiteNode.id, result.testSuiteNode);
        result.results.forEach(r => {
            testSuitesMapIterators.push(...r.testSuitesMap);
            testCasesMapIterators.push(...r.testCasesMap);
        });
    });
    testSuitesMap = new Map([...testSuitesMap, ...testSuitesMapIterators]);
    const testCasesMap = new Map(testCasesMapIterators);
    const { testSuiteInfo, testSuiteNode } = exports.buildRootNodeInfo(rootTestInfoNodes, 'root', 'rust');
    testSuitesMap.set(testSuiteNode.id, testSuiteNode);
    return { rootTestSuite: testSuiteInfo, testSuitesMap, testCasesMap };
};
/**
 * Builds the final result object containing the loaded tests for the workspace.
 *
 * @param {ITestTypeLoadedTestsResult[]} workspaceTestResults - The results of loading tests for the workspace
 *
 * @private - Only exposed for unit testing purposes
 * @returns {ILoadedTestsResult|null} - Returns null on empty/invalid input.
 */
exports.buildWorkspaceLoadedTestsResult = (workspaceTestResults) => {
    if (!workspaceTestResults || workspaceTestResults.length === 0) {
        return null;
    }
    const loadedTestsResults = workspaceTestResults.filter(Boolean);
    if (loadedTestsResults.length === 0) {
        return null;
    }
    return exports.aggregateWorkspaceTestsResults(loadedTestsResults);
};
/**
 * Retrieves the test loader functions to use based on the provided configuration.
 *
 * @param {ICargoPackage[]} packages - The cargo packages in the workspace.
 * @param {Log} log - The logger.
 * @param {IConfiguration} config - The configuration options.
 *
 * @private - Only exposed for unit testing purposes
 * @returns {Promise<ITestTypeLoadedTestsResult>[]}
 */
exports.getTestLoaders = (packages, log, config) => {
    const promises = [];
    if (config.loadUnitTests) {
        promises.push(exports.loadUnitTests(packages, log));
    }
    if (config.loadDocumentationTests) {
        promises.push(exports.loadDocumentationTests(packages, log));
    }
    if (config.loadIntegrationTests) {
        promises.push(exports.loadIntegrationTests(packages, log));
    }
    return promises;
};
/**
 * Loads the all the tests in the specified workspace based on the specified configuration.
 *
 * @param {string} workspaceRoot - The root directory of the Cargo workspace.
 * @param {Log} log - The logger.
 * @param {IConfiguration} config - The configuration options.
 *
 * @returns {Promise<ILoadedTestsResult>}
 */
exports.loadWorkspaceTests = (workspaceRoot, log, config) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        const { packages } = yield cargo_1.getCargoMetadata(workspaceRoot, log);
        if (!packages || packages.length === 0) {
            return Promise.resolve(null);
        }
        const testLoaderPromises = exports.getTestLoaders(packages, log, config);
        const workspaceTestResults = yield Promise.all(testLoaderPromises);
        return exports.buildWorkspaceLoadedTestsResult(workspaceTestResults);
    }
    catch (err) {
        const baseErrorMessage = `Fatal error while attempting to load tests for workspace ${workspaceRoot}`;
        log.debug(`${baseErrorMessage}. Details: ${err}`);
        return Promise.reject(err);
    }
});
//# sourceMappingURL=test-loader.js.map