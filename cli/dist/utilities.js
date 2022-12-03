"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwIfEmpty = void 0;
const istype_1 = require("@theroyalwhee0/istype");
function throwIfEmpty(values) {
    for (const [key, value] of Object.entries(values)) {
        if (value === undefined || value === '' || value === null) {
            throw new Error(`"${key}" is required but empty: "${value}" [${(0, istype_1.getTypeOf)(value)}]`);
        }
    }
}
exports.throwIfEmpty = throwIfEmpty;
//# sourceMappingURL=utilities.js.map