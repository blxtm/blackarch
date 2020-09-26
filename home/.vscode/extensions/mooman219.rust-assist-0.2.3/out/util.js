"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require("child_process");
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
function spawn(cmd, args, options) {
    console.log(`Rust Assist: Running '${cmd} ${args ? args.join(' ') : ''}'`);
    return new Promise((resolve, reject) => {
        let stdout = '';
        let stderr = '';
        const proc = child_process.spawn(cmd, args, options);
        proc.stdout.on('data', (data) => stdout += data);
        proc.stderr.on('data', (data) => stderr += data);
        proc.on('close', (code) => resolve({ stdout, stderr, code }));
        proc.on('error', (err) => reject(err));
    });
}
exports.spawn = spawn;
class Project {
    constructor(path) {
        this._path = path;
    }
    get path() {
        return this._path;
    }
    hasRootFile(fileName) {
        let filePath = path.join(this._path, fileName);
        return new Promise((resolve, reject) => {
            fs.access(filePath, fs.constants.F_OK, (err) => resolve(err ? false : true));
        });
    }
}
exports.Project = Project;
class ProjectList {
    constructor(projects) {
        this._projects = projects;
    }
    get projects() {
        return this._projects;
    }
    hasProjects() {
        return this._projects.length > 0;
    }
    getParent(file) {
        for (const project of this._projects) {
            if (file.startsWith(project.path)) {
                return project;
            }
        }
        return undefined;
    }
}
exports.ProjectList = ProjectList;
/**
 * Find all projects in the workspace that contain a Cargo.toml file.
 *
 * @returns A project list.
 */
function findProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        let projects = [];
        (yield vscode.workspace.findFiles('**/Cargo.toml')).forEach(path => {
            projects.push(new Project(path.fsPath.replace(/[/\\]?Cargo\.toml$/, '')));
        });
        return new ProjectList(projects);
    });
}
exports.findProjects = findProjects;
//# sourceMappingURL=util.js.map