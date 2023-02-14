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
 * A rule extractor function.
 */
export type RuleExtractor<T> = (decl: Declaration, match: RegExpExecArray) => T | undefined;
/**
 * Is the node a CSS Rule node?
 * @ignore
 * @param node Node to check.
 * @returns True if CSS Rule, else false.
 */
export declare function isCssRule(node: Node): node is Rule;
/**
 * Is the node a CSS Rule Declaration node?
 * @ignore
 * @param decl Node to check.
 * @returns True if CSS Rule Declaration, else false.
 */
export declare function isRuleDeclaration(decl: Comment | Declaration): decl is Declaration;
/**
 * Stringify a rule's properties w/o selector or block.
 * @ignore
 * @param rule The rule to stringify.
 * @returns The stringified rule w/o selector or block.
 */
export declare function stringifyRuleProps(rule: Rule): string;
/**
 * Stringify a single rule stylesheet.
 * @ignore
 * @param rule The rule to stringify.
 * @returns The stringified rule.
 */
export declare function stringifyRule(rule: Rule): string;
/**
 * Extract normal CSS rules.
 * @ignore
 * @param rule The rule to extract from.
 * @returns The normal CSS rules.
 */
export declare function extractNormalRules(rule: Rule): Rule;
/**
 * Extract attribute-rules from rule.
 * @ignore
 * @param rule The rule to extract from.
 * @returns The attribute-rules that were extracted.
 */
export declare function extractAttribRules(rule: Rule): AttribRule[];
/**
 * Extract text-rules from rule.
 * @ignore
 * @param rule The rule to extract from.
 * @returns The text-rules that were extracted.
 */
export declare function extractTextRules(rule: Rule): TextRule[];
/**
 * Extract values from rules by matching properties and using a function to perform extract.
 * @ignore
 * @param rule The rule to extract from.
 * @param regexp The pattern to match against the property name.
 * @param fn The extraction function.
 * @returns The resulting extract.
 */
export declare function extractRules<T>(rule: Rule, regexp: RegExp, fn: RuleExtractor<T>): T[];
