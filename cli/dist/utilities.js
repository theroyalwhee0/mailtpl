"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadJSON = exports.throwIfEmpty = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const istype_1 = require("@theroyalwhee0/istype");
function throwIfEmpty(values) {
    for (const [key, value] of Object.entries(values)) {
        if (value === undefined || value === '' || value === null) {
            throw new Error(`"${key}" is required but empty: "${value}" [${(0, istype_1.getTypeOf)(value)}]`);
        }
    }
}
exports.throwIfEmpty = throwIfEmpty;
async function loadJSON(fileName) {
    const content = await promises_1.default.readFile(fileName, 'utf8');
    const data = JSON.parse(content);
    return data;
}
exports.loadJSON = loadJSON;
//# sourceMappingURL=utilities.js.map