'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cargo_1 = require("./cargo");
const pretty_test_result_parser_1 = require("./parsers/pretty-test-result-parser");
/**
 * Runs a single test case.
 *
 * @param {ITestCaseNode} testCaseNode - The test case to run.
 * @param {string} workspaceRoot - The root directory of the Cargo workspace.
 * @param {Log} log - The logger.
 * @param {IConfiguration} config - The configuration options.
 */
exports.runTestCase = (testCaseNode, workspaceRootDir, log, _config) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const { packageName, nodeTarget, testSpecName, nodeIdPrefix } = testCaseNode;
            const params = {
                cargoSubCommandArgs: `${testSpecName} -q`,
                nodeTarget: nodeTarget,
                packageName,
                targetWorkspace: workspaceRootDir,
                testBinaryArgs: '--exact'
            };
            const output = yield cargo_1.runCargoTestsForPackageTargetWithPrettyFormat(params);
            resolve(pretty_test_result_parser_1.parseTestCaseResultPrettyOutput(nodeIdPrefix, output)[0]);
        }
        catch (err) {
            const testName = testCaseNode && testCaseNode.testSpecName ? testCaseNode.testSpecName : 'unknown';
            const baseErrorMessage = `Fatal error while attempting to run Test Case: ${testName}`;
            log.debug(`${baseErrorMessage}. Details: ${err}`);
            reject(err);
        }
    }));
});
/**
 * Runs a test suite.
 *
 * @param {ITestSuiteNode} testCaseNode - The test suite to run.
 * @param {string} workspaceRoot - The root directory of the Cargo workspace.
 * @param {Log} log - The logger.
 * @param {IConfiguration} config - The configuration options.
 */
exports.runTestSuite = (testSuiteNode, workspaceRootDir, log, _config) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const { packageName, testSpecName, targets, id } = testSuiteNode;
            const results = yield Promise.all(targets.map((target) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const testIdPrefix = `${packageName}::${target.targetName}::${target.targetType}`;
                const params = {
                    cargoSubCommandArgs: `${testSpecName} --no-fail-fast -q`,
                    nodeTarget: target,
                    packageName,
                    targetWorkspace: workspaceRootDir
                };
                const output = yield cargo_1.runCargoTestsForPackageTargetWithPrettyFormat(params);
                return pretty_test_result_parser_1.parseTestCaseResultPrettyOutput(testIdPrefix, output).filter(e => e.test.toString().startsWith(id));
            })));
            resolve([].concat(...results));
        }
        catch (err) {
            const suiteName = testSuiteNode && testSuiteNode.testSpecName ? testSuiteNode.testSpecName : 'unknown';
            const baseErrorMessage = `Fatal error while attempting to run Test Suite: ${suiteName}`;
            log.debug(`${baseErrorMessage}. Details: ${err}`);
            reject(err);
        }
    }));
});
//# sourceMappingURL=test-runner.js.map