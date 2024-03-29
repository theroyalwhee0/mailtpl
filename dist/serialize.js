"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeHtml = void 0;
const elements_1 = require("./elements");
/**
 * Serialize HTML from a document.
 * @ignore
 * @param $ The document to serialize.
 * @param trim Trim the results?
 * @returns The document as HTML.
 */
function serializeHtml($, trim) {
    (0, elements_1.removeAttribute)($, '-text-hide');
    (0, elements_1.removeAttribute)($, '-text-begin');
    (0, elements_1.removeAttribute)($, '-text-end');
    let html = $.html();
    if (trim) {
        html = html.trim();
    }
    return html;
}
exports.serializeHtml = serializeHtml;
//# sourceMappingURL=serialize.js.map