"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFromString = void 0;
const cheerio_1 = require("cheerio");
const meta = __importStar(require("./contants"));
const elements_1 = require("./elements");
function buildFromString(template, options) {
    const trim = options?.trim ?? true;
    const removeComments = options?.removeComments ?? true;
    const removeIds = options?.removeIds ?? true;
    const removeClasses = options?.removeClasses ?? true;
    const contents = trim ? template.trim() : template;
    const $ = (0, cheerio_1.load)(contents, null, false);
    const subject = (0, elements_1.getFirstMetaValue)($, meta.META_MAIL_SUBJECT);
    const name = (0, elements_1.getFirstMetaValue)($, meta.META_MAIL_NAME);
    const ident = options?.ident ?? (0, elements_1.getFirstMetaValue)($, meta.META_MAIL_IDENT);
    const fromEmail = (0, elements_1.getFirstMetaValue)($, meta.META_MAIL_FROMEMAIL);
    const fromName = (0, elements_1.getFirstMetaValue)($, meta.META_MAIL_FROMNAME);
    const styles = (0, elements_1.getOrderedStyles)($, options?.styles);
    const source = options?.source ?? '';
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
        source() {
            return source;
        },
        name() {
            return name;
        },
        ident() {
            return ident;
        },
        fromEmail() {
            return fromEmail;
        },
        fromName() {
            return fromName;
        },
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