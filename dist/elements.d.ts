import { Cheerio, CheerioAPI, Element } from 'cheerio';
import { Rule as CssRule, Stylesheet } from 'css';
import { StyleSource } from './css';
/**
 * Get the first meta element matching the name.
 * Throws if there are multiple.
 * @ignore
 * @param $ The document.
 * @param name The name of the metadata.
 * @returns The metadata element.
 */
export declare function getFirstMeta($: CheerioAPI, name: string): Cheerio<Element>;
/**
 * Get the value of the meta element matching the name.
 * Throws if there are multiple.
 * @ignore
 * @param $ The document.
 * @param name The name of the metadata.
 * @returns The metadata element's value.
 */
export declare function getFirstMetaValue($: CheerioAPI, name: string): undefined | string;
/**
 * Get any style elemnts to be processed.
 * Must maintain order.
 * @ignore
 * @param $ The document.
 * @returns The style elements.
 */
export declare function getOrderedStyleElements($: CheerioAPI): Cheerio<Element>;
/**
 * Get text or comment contents.
 * Removes HTML comment from the contents.
 * @ignore
 * @param $ The document.
 * @param ele The element.
 * @returns The contents.
 */
export declare function getTextOrComment($: CheerioAPI, ele: Cheerio<Element>): string;
/**
 * Get stylesheets in document order.
 * @ignore
 * @param $ The document.
 * @param supplied Additional supplied stylesheets, added first. Optional.
 * @returns The stylesheets in order.
 */
export declare function getOrderedStyles($: CheerioAPI, supplied?: StyleSource[]): Stylesheet[];
/**
 * Remove comment nodes from document.
 * @ignore
 * @param $ The document.
 */
export declare function removeCommentNodes($: CheerioAPI): void;
/**
 * Remove various elements.
 * @ignore
 * @param $ The document.
 */
export declare function removeElements($: CheerioAPI): void;
/**
 * Apply normal styles from stylesheets to an element.
 * @ignore
 * @param $ The document.
 * @param ele The element to apply to.
 * @param cssRule The rule to apply.
 */
export declare function applyNormalStyleRule($: CheerioAPI, ele: Cheerio<Element>, cssRule: CssRule): void;
/**
 * Apply attribute styles from stylesheets to an element.
 * @ignore
 * @param $ The document.
 * @param ele The element to apply to.
 * @param cssRule The rule to apply.
 */
export declare function applyAttrStyleRule($: CheerioAPI, ele: Cheerio<Element>, cssRule: CssRule): void;
/**
 * Apply text styles from stylesheets to an element.
 * @ignore
 * @param $ The document.
 * @param ele The element to apply to.
 * @param cssRule The rule to apply.
 */
export declare function applyTextStyleRule($: CheerioAPI, ele: Cheerio<Element>, cssRule: CssRule): void;
/**
 * Apply all styles from stylesheets to an element.
 * @ignore
 * @param $ The document.
 * @param ele The element to apply to.
 * @param cssRule The rule to apply.
 */
export declare function applyStyleRule($: CheerioAPI, ele: Cheerio<Element>, cssRule: CssRule): void;
/**
 * Apply stylesheets to a document.
 * @ignore
 * @param $ The document.
 * @param styles The stylesheets to apply.
 */
export declare function applyStyles($: CheerioAPI, styles: Stylesheet[]): void;
/**
 * Remove attributes from a document by name.
 * @ignore
 * @param $ The document.
 * @param name The attribute name.
 */
export declare function removeAttribute($: CheerioAPI, name: string): void;
