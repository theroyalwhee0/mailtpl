import { load as cheerioLoad } from 'cheerio';
import { META_MAIL_SUBJECT } from './contants';
import { StyleSource } from './css';
import { applyStyles, getFirstMetaValue, getOrderedStyles, removeCommentNodes, removeElements } from './elements';

export type MailTplOptions = {
    removeComments?: boolean, // Defaults to true.
    trim?: boolean, // Defaults to true.
    styles?: StyleSource[]
};

export type MailingTemplate = {
    subject(): string | undefined,
    html(): string,
};

export function buildFromString(template: string, options?: MailTplOptions): MailingTemplate {
    const trim = options?.trim ?? true;
    const removeComments = options?.removeComments ?? true;
    const contents = trim ? template.trim() : template;
    const $ = cheerioLoad(contents, null, false);
    const subject = getFirstMetaValue($, META_MAIL_SUBJECT);
    const styles = getOrderedStyles($, options?.styles);
    applyStyles($, styles);
    removeElements($);
    if (removeComments) {
        removeCommentNodes($);
    }
    let html = $.html();
    if (trim) {
        html = html.trim();
    }
    return {
        html() {
            return html;
        },
        subject() {
            return subject;
        },
    };
}
