"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFromString = void 0;
const cheerio_1 = require("cheerio");
const contants_1 = require("./contants");
const elements_1 = require("./elements");
function buildFromString(template, options) {
    const trim = options?.trim ?? true;
    const removeComments = options?.removeComments ?? true;
    const removeIds = options?.removeIds ?? true;
    const removeClasses = options?.removeClasses ?? true;
    const contents = trim ? template.trim() : template;
    const $ = (0, cheerio_1.load)(contents, null, false);
    const subject = (0, elements_1.getFirstMetaValue)($, contants_1.META_MAIL_SUBJECT);
    const styles = (0, elements_1.getOrderedStyles)($, options?.styles);
    (0, elements_1.applyStyles)($, styles);
    (0, elements_1.removeElements)($);
    if (removeIds) {
        (0, elements_1.removeIdAttribs)($);
    }
    if (removeClasses) {
        (0, elements_1.removeClassAttribs)($);
    }
    if (removeComments) {
        (0, elements_1.removeCommentNodes)($);
    }
    let html = $.html();
    if (trim) {
        html = html.trim();
    }
    return {
        html() {
            return html;
        },
        subject() {
            return subject;
        },
    };
}
exports.buildFromString = buildFromString;
//# sourceMappingURL=buildfromstring.js.map