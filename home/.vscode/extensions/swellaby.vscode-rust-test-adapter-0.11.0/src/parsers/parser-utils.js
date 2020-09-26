'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestEventState = (result) => {
    if (result === 'ok') {
        return 'passed';
    }
    else if (result === 'failed') {
        return 'failed';
    }
    else {
        return 'skipped';
    }
};
exports.buildTestEvent = (testEventState, testId, message) => {
    return {
        test: testId,
        state: testEventState,
        message,
        type: 'test'
    };
};
exports.buildErroredTestEvent = (testId, message) => {
    return exports.buildTestEvent('errored', testId, message);
};
//# sourceMappingURL=parser-utils.js.map