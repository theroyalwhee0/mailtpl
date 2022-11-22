import { Stylesheet, Rule, Node, Declaration, Comment } from 'css';
/**
 * An attribute rule to be applied to the Element.
 */
export type AttribRule = {
    name: string;
    value?: string;
    remove?: boolean;
};
/**
 * A stylesheet source factory.
 */
export type StyleSourceFunc = () => Stylesheet;
/**
 * A stylesheet source.
 */
export type StyleSource = Stylesheet | string | StyleSourceFunc;
/**
 * Is the node a CSS Rule node?
 * @param node Node to check.
 * @returns True if CSS Rule, else false.
 */
export declare function isCssRule(node: Node): node is Rule;
/**
 * Is the node a CSS Rule Declaration node?
 * @param decl Node to check.
 * @returns True if CSS Rule Declaration, else false.
 */
export declare function isRuleDeclaration(decl: Comment | Declaration): decl is Declaration;
/**
 * Stringify a rule's properties w/o selector or block.
 * @param rule The rule to stringify.
 * @returns The stringified rule w/o selector or block.
 */
export declare function stringifyRuleProps(rule: Rule): string;
/**
 * Stringify a single rule stylesheet.
 * @param rule The rule to stringify.
 * @returns The stringified rule.
 */
export declare function stringifyRule(rule: Rule): string;
/**
 * Extract attributes from rule.
 * This removes the attribut rules from the rule.
 * @param rule The rule to extract from.
 * @returns The attribute rules that were extracted.
 */
export declare function extractAttribFromRule(rule: Rule): AttribRule[];
