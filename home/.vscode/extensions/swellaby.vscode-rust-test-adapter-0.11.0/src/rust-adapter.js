'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const test_loader_1 = require("./test-loader");
const test_runner_1 = require("./test-runner");
/**
 * Implementation of the TestAdapter interface for Rust Tests.
 */
class RustAdapter {
    // tslint:disable:typedef
    constructor(workspaceRootDirectoryPath, log, testsEmitter, testStatesEmitter, autorunEmitter) {
        this.workspaceRootDirectoryPath = workspaceRootDirectoryPath;
        this.log = log;
        this.testsEmitter = testsEmitter;
        this.testStatesEmitter = testStatesEmitter;
        this.autorunEmitter = autorunEmitter;
        this.disposables = [];
        this.log.info('Initializing Rust adapter');
        this.testSuites = new Map();
        this.testCases = new Map();
        this.disposables.push(this.testsEmitter);
        this.disposables.push(this.testStatesEmitter);
        this.disposables.push(this.autorunEmitter);
    }
    // tslint:enable:typedef
    get tests() { return this.testsEmitter.event; }
    get testStates() { return this.testStatesEmitter.event; }
    get autorun() { return this.autorunEmitter.event; }
    load() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.log.info('Loading Rust Tests');
            this.testsEmitter.fire({ type: 'started' });
            try {
                const loadedTests = yield test_loader_1.loadWorkspaceTests(this.workspaceRootDirectoryPath, this.log, { loadUnitTests: true });
                if (!loadedTests) {
                    this.log.warn('No tests found in workspace');
                    this.testsEmitter.fire({ type: 'finished' });
                }
                else {
                    this.testCases = loadedTests.testCasesMap;
                    this.testSuites = loadedTests.testSuitesMap;
                    this.testsEmitter.fire({ type: 'finished', suite: loadedTests.rootTestSuite });
                }
            }
            catch (err) {
                this.log.error(`Error loading tests: ${err}`);
                this.testsEmitter.fire({ type: 'finished' });
            }
        });
    }
    runTestSuites(testSuites) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield Promise.all(testSuites.map((testSuite) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const results = yield test_runner_1.runTestSuite(testSuite, this.workspaceRootDirectoryPath, this.log, null);
                results.forEach(result => this.testStatesEmitter.fire(result));
            })));
        });
    }
    runTestCases(testCases) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield Promise.all(testCases.map((testCase) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const result = yield test_runner_1.runTestCase(testCase, this.workspaceRootDirectoryPath, this.log, null);
                this.testStatesEmitter.fire(result);
            })));
        });
    }
    extractTestTargetsFromNodes(nodeId, targetNodes) {
        if (this.testSuites.has(nodeId)) {
            const node = this.testSuites.get(nodeId);
            if (node.isStructuralNode) {
                node.childrenNodeIds.forEach(id => {
                    return this.extractTestTargetsFromNodes(id, targetNodes);
                });
            }
            else {
                targetNodes.testSuites.push(node);
                return targetNodes;
            }
        }
        else {
            targetNodes.testCases.push(this.testCases.get(nodeId));
            return targetNodes;
        }
    }
    runTargetsForSuiteNode(nodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const targetNodes = { testCases: [], testSuites: [] };
            this.extractTestTargetsFromNodes(nodeId, targetNodes);
            yield Promise.all([
                yield this.runTestSuites(targetNodes.testSuites),
                yield this.runTestCases(targetNodes.testCases)
            ]);
        });
    }
    run(nodeIds) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.log.info('Running Rust Tests');
            this.testStatesEmitter.fire({ type: 'started', tests: nodeIds });
            try {
                yield Promise.all(nodeIds.map((nodeId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (this.testCases.has(nodeId)) {
                        yield this.runTestCases([this.testCases.get(nodeId)]);
                    }
                    else {
                        yield this.runTargetsForSuiteNode(nodeId);
                    }
                })));
            }
            catch (err) {
                this.log.error(`Run error: ${err}`);
            }
            this.testStatesEmitter.fire({ type: 'finished' });
        });
    }
    debug(_tests) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // TODO: start a test run in a child process and attach the debugger to it
            throw new Error('Method not implemented.');
        });
    }
    cancel() {
        // TODO: kill the child process for the current test run (if there is any)
        throw new Error('Method not implemented.');
    }
    dispose() {
        this.cancel();
        for (const disposable of this.disposables) {
            disposable.dispose();
        }
        this.disposables = [];
        this.testCases.clear();
        this.testSuites.clear();
    }
}
exports.RustAdapter = RustAdapter;
//# sourceMappingURL=rust-adapter.js.map