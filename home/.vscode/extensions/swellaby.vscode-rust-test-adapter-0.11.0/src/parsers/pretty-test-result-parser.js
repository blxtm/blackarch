'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const parser_utils_1 = require("./parser-utils");
const parseTestResult = (testIdPrefix, testOutputLine) => {
    const testLine = testOutputLine.split(' ... ');
    const testName = testLine[0];
    const test = `${testIdPrefix}::${testName}`;
    const rhs = testLine[1];
    if (!rhs) {
        return parser_utils_1.buildErroredTestEvent(test);
    }
    const firstNewLineIndex = rhs.indexOf('\n');
    const testResult = firstNewLineIndex > 0 ? rhs.substring(0, firstNewLineIndex).toLowerCase() : rhs.toLowerCase();
    const state = parser_utils_1.getTestEventState(testResult);
    return parser_utils_1.buildTestEvent(state, test);
};
// TODO: We need to check for and parse `failures` first, probably into some kind of Dictionary
// that is keyed off the test name. That data structure then needs to be funneled along to the
// parsing of the test result
const extractTestEventResultsFromPrettyOutput = (testIdPrefix, output, startMessageIndex) => {
    const testResults = [];
    const startMessageEndIndex = output.indexOf('\n', startMessageIndex);
    const startMessageSummary = output.substring(startMessageIndex, startMessageEndIndex);
    if (startMessageSummary !== 'running 0 tests') {
        const testResultsOutput = output.substring(startMessageEndIndex).split('\n\n')[0];
        const testResultLines = testResultsOutput.split('\ntest ');
        // First element will be an empty string as `testResultsOutput` starts with `\ntest `
        for (let i = 1; i < testResultLines.length; i++) {
            testResults.push(parseTestResult(testIdPrefix, testResultLines[i]));
        }
    }
    return testResults;
};
/**
 * Parses the cargo test result output in the `pretty` format.
 *
 * @param {string} testIdPrefix - The test ID prefix for the associated test nodes.
 * @param {string} output - The raw `cargo test` result output in the `pretty` format.
 *
 * @returns {TestEvent[]}
 */
exports.parseTestCaseResultPrettyOutput = (testIdPrefix, output) => {
    if (!output) {
        return [];
    }
    const startMessageIndex = output.search(/running \d* (test|tests)/);
    if (startMessageIndex < 0) {
        return [];
    }
    return extractTestEventResultsFromPrettyOutput(testIdPrefix, output, startMessageIndex);
};
//# sourceMappingURL=pretty-test-result-parser.js.map