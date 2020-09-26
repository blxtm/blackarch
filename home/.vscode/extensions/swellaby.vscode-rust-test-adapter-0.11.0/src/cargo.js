'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const target_type_1 = require("./enums/target-type");
// https://doc.rust-lang.org/reference/linkage.html
// Other types of various lib targets that may be listed in the Cargo metadata.
// However, we still need to use --lib for both test detection and execution with all of these.
// See https://github.com/swellaby/vscode-rust-test-adapter/issues/34
// and https://github.com/swellaby/vscode-rust-test-adapter/issues/52
const libTargetTypes = [
    'cdylib',
    'dylib',
    'proc-macro',
    'rlib',
    'staticlib'
];
const unitTestTargetTypes = [target_type_1.TargetType.bin, target_type_1.TargetType.lib];
exports.runCargoCommand = (subCommand, args, targetWorkspace, maxBuffer, allowStderr = false, requireStderr = false) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const cmd = `cargo ${subCommand} ${args}`;
        const execArgs = {
            cwd: targetWorkspace,
            maxBuffer
        };
        child_process_1.exec(cmd, execArgs, (err, stdout, stderr) => {
            if (err) {
                if (!allowStderr) {
                    return reject(err);
                }
                else if (!stderr && requireStderr) {
                    return reject(err);
                }
            }
            resolve(stdout);
        });
    });
});
exports.getCargoMetadata = (targetWorkspace, log, maxBuffer = 300 * 1024) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const cargoSubCommand = 'metadata';
        const args = '--no-deps --format-version 1';
        try {
            const stdout = yield exports.runCargoCommand(cargoSubCommand, args, targetWorkspace, maxBuffer);
            const cargoMetadata = JSON.parse(stdout);
            resolve(cargoMetadata);
        }
        catch (err) {
            const baseErrorMessage = 'Unable to parse cargo metadata output';
            log.debug(`${baseErrorMessage}. Details: ${err}`);
            reject(new Error(baseErrorMessage));
        }
    }));
});
exports.getCargoTestListOutput = (targetWorkspace, log, testArgs = '', maxBuffer = 400 * 1024) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const cargoSubCommand = 'test';
        const args = `${testArgs} -- --list`;
        try {
            const stdout = yield exports.runCargoCommand(cargoSubCommand, args, targetWorkspace, maxBuffer);
            resolve(stdout);
        }
        catch (err) {
            const baseErrorMessage = 'Unable to retrieve enumeration of tests';
            log.debug(`${baseErrorMessage}. Details: ${err}`);
            reject(new Error(baseErrorMessage));
        }
    }));
});
exports.getCargoPackageTargetFilter = (packageName, nodeTarget) => {
    const { targetName, targetType } = nodeTarget;
    if (targetType === target_type_1.TargetType.lib) {
        return `-p ${packageName} --lib`;
    }
    else if (targetType === target_type_1.TargetType.bin) {
        return `-p ${packageName} --bin ${targetName}`;
    }
    else {
        return `-p ${packageName} --test ${targetName}`;
    }
};
exports.getCargoNodeTarget = (target, log) => {
    const targetName = target.name;
    const targetKind = target.kind[0];
    let targetType = target_type_1.TargetType[targetKind];
    if (libTargetTypes.includes(targetKind)) {
        targetType = target_type_1.TargetType.lib;
    }
    if (!targetType) {
        log.warn(`Unsupported target type: ${targetKind} for ${targetName}`);
        return undefined;
    }
    return {
        targetType,
        targetName
    };
};
exports.getCargoTestListForPackage = (cargoPackage, log, allowedTargetTypes, additionalArgs = '') => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!cargoPackage) {
            return reject(new Error('Invalid value specified for parameter `cargoPackage`. Unable to load tests for null/undefined package.'));
        }
        const { manifest_path: manifestPath, name: packageName, targets } = cargoPackage;
        try {
            const packageRootDirectory = manifestPath.endsWith('Cargo.toml') ? manifestPath.slice(0, -10) : manifestPath;
            // Map/filter is used instead of reduce because the number of targets will be pretty small. The far more expensive work is done by
            // cargo with each invocation, so it's better to fire all of those requests off asynchronously with map/filter and iterate over
            // the list twice vs. using reduce and invoking the cargo commands sequentially.
            const cargoTestListResults = yield Promise.all(targets.map((target) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const nodeTarget = exports.getCargoNodeTarget(target, log);
                if (!nodeTarget || !allowedTargetTypes.includes(nodeTarget.targetType)) {
                    return undefined;
                }
                const filter = exports.getCargoPackageTargetFilter(packageName, nodeTarget);
                const cargoTestArgs = `${filter}${additionalArgs ? ` ${additionalArgs}` : ''}`;
                const output = yield exports.getCargoTestListOutput(packageRootDirectory, log, cargoTestArgs);
                return { output, nodeTarget };
            })));
            resolve(cargoTestListResults.filter(Boolean));
        }
        catch (err) {
            const baseErrorMessage = `Failed to load tests for package: ${packageName}.`;
            log.debug(`${baseErrorMessage}. Details: ${err}`);
            reject(new Error(baseErrorMessage));
        }
    }));
});
exports.getCargoUnitTestListForPackage = (cargoPackage, log, additionalArgs = '') => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return exports.getCargoTestListForPackage(cargoPackage, log, unitTestTargetTypes, additionalArgs);
});
exports.runCargoTestsForPackageTargetWithFormat = (params, format, maxBuffer = 200 * 1024) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const cargoSubCommand = 'test';
        const { packageName, nodeTarget, targetWorkspace, cargoSubCommandArgs, testBinaryArgs, log } = params;
        try {
            const filter = exports.getCargoPackageTargetFilter(packageName, nodeTarget);
            const subArgs = `${cargoSubCommandArgs ? ` ${cargoSubCommandArgs}` : ''}`;
            const binaryArgs = `${testBinaryArgs ? ` ${testBinaryArgs}` : ''}`;
            const args = `${filter}${subArgs} -- --format ${format}${binaryArgs}`;
            const stdout = yield exports.runCargoCommand(cargoSubCommand, args, targetWorkspace, maxBuffer, true, false);
            resolve(stdout);
        }
        catch (err) {
            const baseErrorMessage = 'Fatal error while attempting to run tests';
            log.debug(`${baseErrorMessage}. Details: ${err}`);
            reject(new Error(baseErrorMessage));
        }
    }));
});
exports.runCargoTestsForPackageTargetWithPrettyFormat = (params, maxBuffer = 200 * 1024) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return exports.runCargoTestsForPackageTargetWithFormat(params, 'pretty', maxBuffer);
});
//# sourceMappingURL=cargo.js.map