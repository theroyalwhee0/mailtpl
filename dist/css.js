"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractRules = exports.extractTextRules = exports.extractAttribRules = exports.extractNormalRules = exports.stringifyRule = exports.stringifyRuleProps = exports.isRuleDeclaration = exports.isCssRule = void 0;
const css_1 = require("css");
/**
 * Is the node a CSS Rule node?
 * @ignore
 * @param node Node to check.
 * @returns True if CSS Rule, else false.
 */
function isCssRule(node) {
    return node.type === 'rule';
}
exports.isCssRule = isCssRule;
/**
 * Is the node a CSS Rule Declaration node?
 * @ignore
 * @param decl Node to check.
 * @returns True if CSS Rule Declaration, else false.
 */
function isRuleDeclaration(decl) {
    return decl.type === 'declaration';
}
exports.isRuleDeclaration = isRuleDeclaration;
/**
 * Stringify a rule's properties w/o selector or block.
 * @ignore
 * @param rule The rule to stringify.
 * @returns The stringified rule w/o selector or block.
 */
function stringifyRuleProps(rule) {
    const value = stringifyRule(rule);
    return value.replace(/^[^{]+\{\s*|\s*\}$/g, '');
}
exports.stringifyRuleProps = stringifyRuleProps;
/**
 * Stringify a single rule stylesheet.
 * @ignore
 * @param rule The rule to stringify.
 * @returns The stringified rule.
 */
function stringifyRule(rule) {
    const styles = {
        type: 'stylesheet',
        stylesheet: {
            rules: [
                rule,
            ],
        },
    };
    return (0, css_1.stringify)(styles, { compress: true });
}
exports.stringifyRule = stringifyRule;
/**
 * Extract normal CSS rules.
 * @ignore
 * @param rule The rule to extract from.
 * @returns The normal CSS rules.
 */
function extractNormalRules(rule) {
    // TODO: Change this to use extractTextRules?
    const cssRule = Object.assign({}, rule, {
        declarations: undefined,
    });
    if (rule.declarations) {
        cssRule.declarations = [];
        for (const decl of rule.declarations) {
            if (isRuleDeclaration(decl)) {
                if (decl.property === undefined || !/^-(text|attr)-(.+)$/.test(decl.property)) {
                    cssRule.declarations.push(decl);
                }
            }
        }
    }
    return cssRule;
}
exports.extractNormalRules = extractNormalRules;
/**
 * Extract attribute-rules from rule.
 * @ignore
 * @param rule The rule to extract from.
 * @returns The attribute-rules that were extracted.
 */
function extractAttribRules(rule) {
    return extractRules(rule, /^-attr-(.+)$/, (decl, match) => {
        const name = match[1];
        const attr = {
            name,
        };
        const value = (decl.value ?? '');
        if (/^['"].*['"]$/g.test(value)) {
            // If quoted, it is a set-value...
            attr.value = value.replace(/^['"]|['"]$/g, '');
        }
        else if (value === 'false') {
            // If false, it is a remove-attribute...
            attr.remove = true;
        }
        return attr;
    });
}
exports.extractAttribRules = extractAttribRules;
/**
 * Extract text-rules from rule.
 * @ignore
 * @param rule The rule to extract from.
 * @returns The text-rules that were extracted.
 */
function extractTextRules(rule) {
    return extractRules(rule, /^-text-(.+)$/, (decl, match) => {
        const name = match[1];
        const value = (decl.value ?? '');
        const text = {
            name, value,
        };
        return text;
    });
}
exports.extractTextRules = extractTextRules;
/**
 * Extract values from rules by matching properties and using a function to perform extract.
 * @ignore
 * @param rule The rule to extract from.
 * @param regexp The pattern to match against the property name.
 * @param fn The extraction function.
 * @returns The resulting extract.
 */
function extractRules(rule, regexp, fn) {
    const rules = [];
    if (rule.declarations) {
        for (const decl of rule.declarations) {
            if (isRuleDeclaration(decl)) {
                const match = regexp.exec(decl.property ?? '');
                if (match) {
                    const result = fn(decl, match);
                    if (result !== undefined) {
                        rules.push(result);
                    }
                }
            }
        }
    }
    return rules;
}
exports.extractRules = extractRules;
//# sourceMappingURL=css.js.map