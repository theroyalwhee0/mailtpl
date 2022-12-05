import { Comment, Declaration, Node, Rule, Stylesheet } from 'css';
/**
 * An attribute rule to be applied to the Element.
 */
export type AttribRule = {
    name: string;
    value?: string;
    remove?: boolean;
};
/**
 * An text rule to be applied to the Element.
 */
export type TextRule = {
    name: string;
    value: string;
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
export declare function extractNormalRules(rule: Rule): Rule;
/**
 * Extract attribute-rules from rule.
 * @param rule The rule to extract from.
 * @returns The attribute-rules that were extracted.
 */
export declare function extractAttribRules(rule: Rule): AttribRule[];
/**
 * Extract text-rules from rule.
 * @param rule The rule to extract from.
 * @returns The text-rules that were extracted.
 */
export declare function extractTextRules(rule: Rule): TextRule[];
export type RuleExtractor<T> = (decl: Declaration, match: RegExpExecArray) => T | undefined;
export declare function extractRules<T>(rule: Rule, regexp: RegExp, fn: RuleExtractor<T>): T[];
