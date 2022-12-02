"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tag = exports.group = void 0;
function group(iter) {
    const grouped = {};
    for (const tagged of iter) {
        const [value, tags] = tagged;
        for (const tag of tags) {
            grouped[tag] = grouped[tag] ?? [];
            grouped[tag].push(value);
        }
    }
    return grouped;
}
exports.group = group;
function* tag(iter, taggers) {
    for (const value of iter) {
        const tags = [];
        for (const name in taggers) {
            if (taggers[name](value) === true) {
                tags.push(name);
            }
        }
        yield [value, tags];
    }
}
exports.tag = tag;
//# sourceMappingURL=iter.js.map