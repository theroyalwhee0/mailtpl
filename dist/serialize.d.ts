import { CheerioAPI } from 'cheerio';
/**
 * Serialize HTML from a document.
 * @ignore
 * @param $ The document to serialize.
 * @param trim Trim the results?
 * @returns The document as HTML.
 */
export declare function serializeHtml($: CheerioAPI, trim: boolean): string;
