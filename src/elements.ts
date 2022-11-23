import { isFunction, isString } from '@theroyalwhee0/istype';
import { Cheerio, CheerioAPI, Element, Node } from 'cheerio';
import { parse as parseCss, Rule as CssRule, Stylesheet } from 'css';
import { extractAttribFromRule, isCssRule, stringifyRuleProps, StyleSource } from './css';
import { META_MAIL_SUBJECT } from './contants';

/**
 * Get the first meta element matching the name.
 * Throws if there are multiple.
 * @param $ The document.
 * @param name The name of the metadata.
 * @returns The metadata element.
 */
export function getFirstMeta($: CheerioAPI, name: string) {
    const ele = $.root().find(`meta[name=${name}]`);
    if (ele.length > 1) {
        throw new Error(`Multiple meta "${name}" elements found`);
    }
    return ele.first();
}

/**
 * Get the value of the meta element matching the name.
 * Throws if there are multiple.
 * @param $ The document.
 * @param name The name of the metadata.
 * @returns The metadata element's value.
 */
export function getFirstMetaValue($: CheerioAPI, name: string): undefined | string {
    const ele = getFirstMeta($, name);
    let value: string | undefined;
    if (ele) {
        value = ele.attr('value');
    }
    return value;
}

/**
 * Get any style elemnts to be processed.
 * Must maintain order.
 * @param $ The document.
 * @returns The style elements.
 */
export function getOrderedStyleElements($: CheerioAPI) {
    return $.root().find('style');
}

/**
 * Get text or comment contents.
 * Removes HTML comment from the contents.
 * @param $ The document.
 * @param ele The element.
 * @returns The contents.
 */
export function getTextOrComment($: CheerioAPI, ele: Cheerio<Element>): string {
    return ele.text().replace(/(^\s*<!--\s*|\s*-->\s*$)/g, '');
}

export function getOrderedStyles($: CheerioAPI, supplied?: StyleSource[]): Stylesheet[] {
    const styleElements = getOrderedStyleElements($);
    const styles: Stylesheet[] = [];
    if (supplied) {
        supplied.forEach((item, idx) => {
            if (isString(item)) {
                styles.push(parseCss(item, {
                    source: `supplied#${idx}`,
                }));
            } else if (isFunction(item)) {
                styles.push(item());
            } else {
                styles.push(item);
            }
        });
    }
    styleElements.each((idx, element) => {
        const ele = $(element);
        if (ele.prop('name') === 'style') {
            const content = getTextOrComment($, ele);
            styles.push(parseCss(content, {
                source: `inline#${idx}`,
            }));
        } else {
            throw new Error('Unsupported style type.');
        }
    });
    return styles;
}

export function isComment(_idx: number, node: Node): boolean {
    return node.type === 'comment';
}

export function removeCommentNodes($: CheerioAPI) {
    // REF: https://github.com/cheeriojs/cheerio/issues/214
    $.root()
        .contents()
        .filter(isComment)
        .remove();
}


export function removeElements($: CheerioAPI) {
    const root = $.root();
    root.find(`meta[name=${META_MAIL_SUBJECT}]`).remove();
    root.find('style').remove();
}

export function applyNormalStyleRule($: CheerioAPI, ele: Cheerio<Element>, rule: CssRule) {
    const existing = (ele.attr('style') || '').replace(/;$/, '');
    const styles = existing +
        (existing ? ';' : '') +
        stringifyRuleProps(rule).replace(/;$/, '');
    if (styles) {
        ele.attr('style', styles);
    }
}

export function applyAttrStyleRule($: CheerioAPI, ele: Cheerio<Element>, rule: CssRule) {
    const attribs = extractAttribFromRule(rule);
    attribs.forEach((attrib) => {
        if (attrib.value !== undefined) {
            ele.attr(attrib.name, attrib.value);
        } else if (attrib.remove === true) {
            ele.removeAttr(attrib.name);
        }
    });
}

export function applyStyleRule($: CheerioAPI, ele: Cheerio<Element>, rule: CssRule) {
    applyAttrStyleRule($, ele, rule);
    applyNormalStyleRule($, ele, rule);
}

export function applyStyles($: CheerioAPI, styles: Stylesheet[]) {
    for (const style of styles) {
        if (!style.stylesheet) {
            continue;
        }
        const { rules } = style.stylesheet;
        for (const rule of rules) {
            if (isCssRule(rule)) {
                if (rule.selectors) {
                    for (const selector of rule.selectors) {
                        const elementsToStyle = $.root().find(selector);
                        elementsToStyle.each((_idx, element) => {
                            applyStyleRule($, $(element), rule);
                        });
                    }
                }
            }
        }
    }
}


export function removeIdAttribs($: CheerioAPI) {
    $.root().find('[id]').removeAttr('id');
}

export function removeClassAttribs($: CheerioAPI) {
    $.root().find('[class]').removeAttr('class');
}
