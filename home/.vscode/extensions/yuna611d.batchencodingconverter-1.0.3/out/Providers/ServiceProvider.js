"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = require("../Services/Service");
class ServiceProvider {
    provide(pattern) {
        if (pattern === ServiceType.SJIStoUTF8) {
            return new Service_1.Service({ srcEncoding: Service_1.Encoding.Shift_JIS, distEncoding: Service_1.Encoding.UTF8 });
        }
        if (pattern === ServiceType.UTF8toSJIS) {
            return new Service_1.Service({ srcEncoding: Service_1.Encoding.UTF8, distEncoding: Service_1.Encoding.Shift_JIS });
        }
        return new Service_1.Service({ srcEncoding: Service_1.Encoding.Shift_JIS, distEncoding: Service_1.Encoding.UTF8 });
    }
}
exports.ServiceProvider = ServiceProvider;
var ServiceType;
(function (ServiceType) {
    ServiceType[ServiceType["SJIStoUTF8"] = 0] = "SJIStoUTF8";
    ServiceType[ServiceType["UTF8toSJIS"] = 1] = "UTF8toSJIS";
})(ServiceType = exports.ServiceType || (exports.ServiceType = {}));
//# sourceMappingURL=ServiceProvider.js.map