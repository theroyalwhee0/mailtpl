"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replacementFactory = void 0;
/**
 * Replacement factory.
 * @ignore
 * @param options Options for replacement.
 * @returns A replacement function.
 */
function replacementFactory(options) {
    const pattern = options?.pattern ?? '\\$\\$([a-zA-Z0-9_]+)\\$\\$';
    const notFound = options?.notFound ?? 'throw';
    const re = new RegExp(pattern, 'g');
    return function replacer(value, data) {
        return value.replace(re, (match, key) => {
            if (key in data) {
                return data[key];
            }
            switch (notFound) {
                // case 'blank': {
                //     return '';
                // }
                // case 'ignore': {
                //     return match;
                // }
                case 'throw': {
                    throw new Error(`replacement failed: data does not have key "${key}"`);
                }
            }
        });
    };
}
exports.replacementFactory = replacementFactory;
//# sourceMappingURL=replacement.js.map