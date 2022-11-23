"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAttribFromRule = exports.stringifyRule = exports.stringifyRuleProps = exports.isRuleDeclaration = exports.isCssRule = void 0;
const css_1 = require("css");
/**
 * Is the node a CSS Rule node?
 * @param node Node to check.
 * @returns True if CSS Rule, else false.
 */
function isCssRule(node) {
    return node.type === 'rule';
}
exports.isCssRule = isCssRule;
/**
 * Is the node a CSS Rule Declaration node?
 * @param decl Node to check.
 * @returns True if CSS Rule Declaration, else false.
 */
function isRuleDeclaration(decl) {
    return decl.type === 'declaration';
}
exports.isRuleDeclaration = isRuleDeclaration;
/**
 * Stringify a rule's properties w/o selector or block.
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
 * Extract attributes from rule.
 * This removes the attribut rules from the rule.
 * @param rule The rule to extract from.
 * @returns The attribute rules that were extracted.
 */
function extractAttribFromRule(rule) {
    const attribs = [];
    const declarations = [];
    if (rule.declarations) {
        for (const decl of rule.declarations) {
            if (isRuleDeclaration(decl)) {
                const match = /^-attr-(.+)$/.exec(decl.property ?? '');
                if (match) {
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
                    attribs.push(attr);
                    continue;
                }
            }
            declarations.push(decl);
        }
        rule.declarations = declarations;
    }
    return attribs;
}
exports.extractAttribFromRule = extractAttribFromRule;
//# sourceMappingURL=css.js.map