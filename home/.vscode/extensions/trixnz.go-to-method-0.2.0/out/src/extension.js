"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const goToMethod_1 = require("./goToMethod");
function activate(context) {
    const goToMethodProvider = new goToMethod_1.GoToMethodProvider();
    goToMethodProvider.initialise(context);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map