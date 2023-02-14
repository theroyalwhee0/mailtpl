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
exports.removeAttribute = exports.applyStyles = exports.applyStyleRule = exports.applyTextStyleRule = exports.applyAttrStyleRule = exports.applyNormalStyleRule = exports.removeElements = exports.removeCommentNodes = exports.getOrderedStyles = exports.getTextOrComment = exports.getOrderedStyleElements = exports.getFirstMetaValue = exports.getFirstMeta = void 0;
const istype_1 = require("@theroyalwhee0/istype");
const css_1 = require("css");
const css_2 = require("./css");
const meta = __importStar(require("./contants"));
/**
 * Get the first meta element matching the name.
 * Throws if there are multiple.
 * @ignore
 * @param $ The document.
 * @param name The name of the metadata.
 * @returns The metadata element.
 */
function getFirstMeta($, name) {
    const ele = $.root().find(`meta[name=${name}]`);
    if (ele.length > 1) {
        throw new Error(`Multiple meta "${name}" elements found`);
    }
    return ele.first();
}
exports.getFirstMeta = getFirstMeta;
/**
 * Get the value of the meta element matching the name.
 * Throws if there are multiple.
 * @ignore
 * @param $ The document.
 * @param name The name of the metadata.
 * @returns The metadata element's value.
 */
function getFirstMetaValue($, name) {
    const ele = getFirstMeta($, name);
    let value;
    if (ele) {
        value = ele.attr('value');
    }
    return value;
}
exports.getFirstMetaValue = getFirstMetaValue;
/**
 * Get any style elemnts to be processed.
 * Must maintain order.
 * @ignore
 * @param $ The document.
 * @returns The style elements.
 */
function getOrderedStyleElements($) {
    return $.root().find('style');
}
exports.getOrderedStyleElements = getOrderedStyleElements;
/**
 * Get text or comment contents.
 * Removes HTML comment from the contents.
 * @ignore
 * @param $ The document.
 * @param ele The element.
 * @returns The contents.
 */
function getTextOrComment($, ele) {
    return ele.text().replace(/(^\s*<!--\s*|\s*-->\s*$)/g, '');
}
exports.getTextOrComment = getTextOrComment;
/**
 * Get stylesheets in document order.
 * @ignore
 * @param $ The document.
 * @param supplied Additional supplied stylesheets, added first. Optional.
 * @returns The stylesheets in order.
 */
function getOrderedStyles($, supplied) {
    const styleElements = getOrderedStyleElements($);
    const styles = [];
    if (supplied) {
        supplied.forEach((item, idx) => {
            if ((0, istype_1.isString)(item)) {
                styles.push((0, css_1.parse)(item, {
                    source: `supplied#${idx}`,
                }));
            }
            else if ((0, istype_1.isFunction)(item)) {
                styles.push(item());
            }
            else {
                styles.push(item);
            }
        });
    }
    styleElements.each((idx, element) => {
        const ele = $(element);
        if (ele.prop('name') === 'style') {
            const content = getTextOrComment($, ele);
            styles.push((0, css_1.parse)(content, {
                source: `inline#${idx}`,
            }));
        }
        else {
            throw new Error('Unsupported style type.');
        }
    });
    return styles;
}
exports.getOrderedStyles = getOrderedStyles;
/**
 * Remove comment nodes from document.
 * @ignore
 * @param $ The document.
 */
function removeCommentNodes($) {
    function isComment(_idx, node) {
        return node.type === 'comment';
    }
    // REF: https://github.com/cheeriojs/cheerio/issues/214
    $.root()
        .contents()
        .filter(isComment)
        .remove();
}
exports.removeCommentNodes = removeCommentNodes;
/**
 * Remove various elements.
 * @ignore
 * @param $ The document.
 */
function removeElements($) {
    const root = $.root();
    root.find(`meta[name=${meta.META_MAIL_NAME}]`).remove();
    root.find(`meta[name=${meta.META_MAIL_SUBJECT}]`).remove();
    root.find(`meta[name=${meta.META_MAIL_IDENT}]`).remove();
    root.find(`meta[name=${meta.META_MAIL_FROMNAME}]`).remove();
    root.find(`meta[name=${meta.META_MAIL_FROMEMAIL}]`).remove();
    root.find('style').remove();
}
exports.removeElements = removeElements;
/**
 * Apply normal styles from stylesheets to an element.
 * @ignore
 * @param $ The document.
 * @param ele The element to apply to.
 * @param cssRule The rule to apply.
 */
function applyNormalStyleRule($, ele, cssRule) {
    const rules = (0, css_2.extractNormalRules)(cssRule);
    const existing = (ele.attr('style') || '').replace(/;$/, '');
    const styles = existing +
        (existing ? ';' : '') +
        (0, css_2.stringifyRuleProps)(rules).replace(/;$/, '');
    if (styles) {
        ele.attr('style', styles);
    }
}
exports.applyNormalStyleRule = applyNormalStyleRule;
/**
 * Apply attribute styles from stylesheets to an element.
 * @ignore
 * @param $ The document.
 * @param ele The element to apply to.
 * @param cssRule The rule to apply.
 */
function applyAttrStyleRule($, ele, cssRule) {
    const rules = (0, css_2.extractAttribRules)(cssRule);
    rules.forEach((rule) => {
        if (rule.value !== undefined) {
            ele.attr(rule.name, rule.value);
        }
        else if (rule.remove === true) {
            ele.removeAttr(rule.name);
        }
    });
}
exports.applyAttrStyleRule = applyAttrStyleRule;
/**
 * Apply text styles from stylesheets to an element.
 * @ignore
 * @param $ The document.
 * @param ele The element to apply to.
 * @param cssRule The rule to apply.
 */
function applyTextStyleRule($, ele, cssRule) {
    const rules = (0, css_2.extractTextRules)(cssRule);
    rules.forEach((rule) => {
        const { name, value } = rule;
        ele.attr(`-text-${name}`, value);
    });
}
exports.applyTextStyleRule = applyTextStyleRule;
/**
 * Apply all styles from stylesheets to an element.
 * @ignore
 * @param $ The document.
 * @param ele The element to apply to.
 * @param cssRule The rule to apply.
 */
function applyStyleRule($, ele, cssRule) {
    applyAttrStyleRule($, ele, cssRule);
    applyTextStyleRule($, ele, cssRule);
    applyNormalStyleRule($, ele, cssRule);
}
exports.applyStyleRule = applyStyleRule;
/**
 * Apply stylesheets to a document.
 * @ignore
 * @param $ The document.
 * @param styles The stylesheets to apply.
 */
function applyStyles($, styles) {
    for (const style of styles) {
        if (!style.stylesheet) {
            continue;
        }
        const { rules } = style.stylesheet;
        for (const rule of rules) {
            if ((0, css_2.isCssRule)(rule)) {
                if (rule.selectors) {
                    for (const selector of rule.selectors) {
                        const elementsToStyle = $.root().find(selector);
                        if (elementsToStyle.length) {
                            elementsToStyle.each((_idx, element) => {
                                applyStyleRule($, $(element), rule);
                            });
                        }
                    }
                }
            }
        }
    }
}
exports.applyStyles = applyStyles;
/**
 * Remove attributes from a document by name.
 * @ignore
 * @param $ The document.
 * @param name The attribute name.
 */
function removeAttribute($, name) {
    $.root().find(`[${name}]`).removeAttr(name);
}
exports.removeAttribute = removeAttribute;
//# sourceMappingURL=elements.js.map