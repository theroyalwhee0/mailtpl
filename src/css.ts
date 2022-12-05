import { Comment, Declaration, Node, Rule, stringify, Stylesheet } from 'css';

/**
 * An attribute rule to be applied to the Element.
 */
export type AttribRule = {
    name: string,
    value?: string,
    remove?: boolean
};

/**
 * An text rule to be applied to the Element.
 */
export type TextRule = {
    name: string,
    value: string,
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
export function isCssRule(node: Node): node is Rule {
    return node.type === 'rule';
}

/**
 * Is the node a CSS Rule Declaration node?
 * @param decl Node to check.
 * @returns True if CSS Rule Declaration, else false.
 */
export function isRuleDeclaration(decl: Comment | Declaration): decl is Declaration {
    return decl.type === 'declaration';
}

/**
 * Stringify a rule's properties w/o selector or block.
 * @param rule The rule to stringify.
 * @returns The stringified rule w/o selector or block.
 */
export function stringifyRuleProps(rule: Rule): string {
    const value = stringifyRule(rule);
    return value.replace(/^[^{]+\{\s*|\s*\}$/g, '');
}

/**
 * Stringify a single rule stylesheet.
 * @param rule The rule to stringify.
 * @returns The stringified rule.
 */
export function stringifyRule(rule: Rule): string {
    const styles = {
        type: 'stylesheet',
        stylesheet: {
            rules: [
                rule,
            ],
        },
    };
    return stringify(styles, { compress: true });
}

export function extractNormalRules(rule: Rule): Rule {
    const cssRule: Rule = Object.assign({}, rule, {
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

/**
 * Extract attribute-rules from rule.
 * @param rule The rule to extract from.
 * @returns The attribute-rules that were extracted.
 */
export function extractAttribRules(rule: Rule): AttribRule[] {
    return extractRules<AttribRule>(rule, /^-attr-(.+)$/, (decl: Declaration, match: RegExpExecArray) => {
        const name = match[1];
        const attr: AttribRule = {
            name,
        };
        const value = (decl.value ?? '');
        if (/^['"].*['"]$/g.test(value)) {
            // If quoted, it is a set-value...
            attr.value = value.replace(/^['"]|['"]$/g, '');
        } else if (value === 'false') {
            // If false, it is a remove-attribute...
            attr.remove = true;
        }
        return attr;
    });
}

/**
 * Extract text-rules from rule.
 * @param rule The rule to extract from.
 * @returns The text-rules that were extracted.
 */
export function extractTextRules(rule: Rule): TextRule[] {
    return extractRules<TextRule>(rule, /^-text-(.+)$/, (decl: Declaration, match: RegExpExecArray) => {
        const name = match[1];
        const value = (decl.value ?? '');
        const text: TextRule = {
            name, value,
        };
        return text;
    });
}

export type RuleExtractor<T> = (decl: Declaration, match: RegExpExecArray) => T | undefined;

export function extractRules<T>(rule: Rule, regexp: RegExp, fn: RuleExtractor<T>): T[] {
    const rules: T[] = [];
    if (rule.declarations) {
        for (const decl of rule.declarations) {
            if (isRuleDeclaration(decl)) {
                const match = /^-text-(.+)$/.exec(decl.property ?? '');
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
