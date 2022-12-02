import { load as cheerioLoad } from 'cheerio';
import * as meta from './contants';
import { StyleSource } from './css';
import { applyStyles, getFirstMetaValue, getOrderedStyles, removeClassAttribs, removeCommentNodes, removeElements, removeIdAttribs } from './elements';

export type MailTplOptions = {
    removeComments?: boolean, // Defaults to true.
    removeIds?: boolean, // Defaults to true.
    removeClasses?: boolean, // Defaults to true.    
    trim?: boolean, // Defaults to true.
    styles?: StyleSource[]
    source?: string,
    ident?: string
};

export type MailingTemplate = {
    source(): string | undefined,
    subject(): string | undefined,
    name(): string | undefined,
    ident(): string | undefined,
    fromEmail(): string | undefined,
    fromName(): string | undefined,
    html(): string,
};

export function buildFromString(template: string, options?: MailTplOptions): MailingTemplate {
    const trim = options?.trim ?? true;
    const removeComments = options?.removeComments ?? true;
    const removeIds = options?.removeIds ?? true;
    const removeClasses = options?.removeClasses ?? true;
    const contents = trim ? template.trim() : template;
    const $ = cheerioLoad(contents, null, false);
    const subject = getFirstMetaValue($, meta.META_MAIL_SUBJECT);
    const name = getFirstMetaValue($, meta.META_MAIL_NAME);
    const ident = options?.ident ?? getFirstMetaValue($, meta.META_MAIL_IDENT);
    const fromEmail = getFirstMetaValue($, meta.META_MAIL_FROMEMAIL);
    const fromName = getFirstMetaValue($, meta.META_MAIL_FROMNAME);
    const styles = getOrderedStyles($, options?.styles);
    const source = options?.source ?? '';
    applyStyles($, styles);
    removeElements($);
    if (removeIds) {
        removeIdAttribs($);
    }
    if (removeClasses) {
        removeClassAttribs($);
    }
    if (removeComments) {
        removeCommentNodes($);
    }
    let html = $.html();
    if (trim) {
        html = html.trim();
    }
    return {
        source() {
            return source;
        },
        name() {
            return name;
        },
        ident() {
            return ident;
        },
        fromEmail() {
            return fromEmail;
        },
        fromName() {
            return fromName;
        },
        html() {
            return html;
        },
        subject() {
            return subject;
        },
    };
}
