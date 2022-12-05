import { CheerioAPI } from 'cheerio';
import { removeAttribute } from '../elements';

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
