import { Stylesheet, stringify, Rule, Node, Declaration, Comment } from 'css';

/**
 * An attribute rule to be applied to the Element.
 */
export type AttribRule = {
    name: string,
    value?: string,
    remove?: boolean
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

/**
 * Extract attributes from rule.
 * This removes the attribut rules from the rule.
 * @param rule The rule to extract from.
 * @returns The attribute rules that were extracted.
 */
export function extractAttribFromRule(rule: Rule): AttribRule[] {
    const attribs: AttribRule[] = [];
    const declarations: Comment | Declaration[] = [];
    if (rule.declarations) {
        for (const decl of rule.declarations) {
            if (isRuleDeclaration(decl)) {
                const match = /^attr-(.+)$/.exec(decl.property ?? '');
                if (match) {
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