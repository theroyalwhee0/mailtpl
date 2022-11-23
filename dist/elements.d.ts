import { Cheerio, CheerioAPI, Element, Node } from 'cheerio';
import { Rule as CssRule, Stylesheet } from 'css';
import { StyleSource } from './css';
/**
 * Get the first meta element matching the name.
 * Throws if there are multiple.
 * @param $ The document.
 * @param name The name of the metadata.
 * @returns The metadata element.
 */
export declare function getFirstMeta($: CheerioAPI, name: string): Cheerio<Element>;
/**
 * Get the value of the meta element matching the name.
 * Throws if there are multiple.
 * @param $ The document.
 * @param name The name of the metadata.
 * @returns The metadata element's value.
 */
export declare function getFirstMetaValue($: CheerioAPI, name: string): undefined | string;
/**
 * Get any style elemnts to be processed.
 * Must maintain order.
 * @param $ The document.
 * @returns The style elements.
 */
export declare function getOrderedStyleElements($: CheerioAPI): Cheerio<Element>;
/**
 * Get text or comment contents.
 * Removes HTML comment from the contents.
 * @param $ The document.
 * @param ele The element.
 * @returns The contents.
 */
export declare function getTextOrComment($: CheerioAPI, ele: Cheerio<Element>): string;
export declare function getOrderedStyles($: CheerioAPI, supplied?: StyleSource[]): Stylesheet[];
export declare function isComment(_idx: number, node: Node): boolean;
export declare function removeCommentNodes($: CheerioAPI): void;
export declare function removeElements($: CheerioAPI): void;
export declare function applyNormalStyleRule($: CheerioAPI, ele: Cheerio<Element>, rule: CssRule): void;
export declare function applyAttrStyleRule($: CheerioAPI, ele: Cheerio<Element>, rule: CssRule): void;
export declare function applyStyleRule($: CheerioAPI, ele: Cheerio<Element>, rule: CssRule): void;
export declare function applyStyles($: CheerioAPI, styles: Stylesheet[]): void;
export declare function removeIdAttribs($: CheerioAPI): void;
export declare function removeClassAttribs($: CheerioAPI): void;
