import { CheerioAPI } from 'cheerio';
import { removeAttribute } from './elements';

/**
 * Serialize HTML from a document.
 * @ignore
 * @param $ The document to serialize.
 * @param trim Trim the results?
 * @returns The document as HTML.
 */
export function serializeHtml($: CheerioAPI, trim: boolean) {
    removeAttribute($, '-text-hide');
    removeAttribute($, '-text-begin');
    removeAttribute($, '-text-end');
    let html = $.html();
    if (trim) {
        html = html.trim();
    }
    return html;
}
