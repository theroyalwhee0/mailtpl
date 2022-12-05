import { load as cheerioLoad } from 'cheerio';
import * as meta from './contants';
import { StyleSource } from './css';
import { applyStyles, getFirstMetaValue, getOrderedStyles, removeAttribute, removeCommentNodes, removeElements } from './elements';
import { serializeHtml } from './html/serialize';
import { serializeText } from './text';
import textStyles from './text/text-styles';

export type MailTplOptions = {
    removeComments?: boolean, // Defaults to true.
    removeIds?: boolean, // Defaults to true.
    removeClasses?: boolean, // Defaults to true.    
    defaultTextStyles?: boolean // Defaults to true.
    trim?: boolean, // Defaults to true.
    styles?: StyleSource[]
    source?: string,
    ident?: string,
};

export type MailingTemplate = {
    source(): string | undefined,
    subject(): string | undefined,
    name(): string | undefined,
    ident(): string | undefined,
    fromEmail(): string | undefined,
    fromName(): string | undefined,
    html(): string,
    text(): string,
};

export function buildFromString(template: string, options?: MailTplOptions): MailingTemplate {
    const trim = options?.trim ?? true;
    const removeComments = options?.removeComments ?? true;
    const removeIds = options?.removeIds ?? true;
    const removeClasses = options?.removeClasses ?? true;
    const defaultTextStyles = options?.defaultTextStyles ?? true;
    const contents = trim ? template.trim() : template;
    const source = options?.source ?? '';
    const $ = cheerioLoad(contents, null, false);
    const subject = getFirstMetaValue($, meta.META_MAIL_SUBJECT);
    const name = getFirstMetaValue($, meta.META_MAIL_NAME);
    const ident = options?.ident ?? getFirstMetaValue($, meta.META_MAIL_IDENT);
    const fromEmail = getFirstMetaValue($, meta.META_MAIL_FROMEMAIL);
    const fromName = getFirstMetaValue($, meta.META_MAIL_FROMNAME);
    let styles = getOrderedStyles($, options?.styles);
    if (defaultTextStyles) {
        styles = [textStyles].concat(styles);
    }
    applyStyles($, styles);
    removeElements($);
    if (removeIds) {
        removeAttribute($, 'id');
    }
    if (removeClasses) {
        removeAttribute($, 'class');
    }
    if (removeComments) {
        removeCommentNodes($);
    }
    const text = serializeText($);
    const html = serializeHtml($, trim);
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
        text() {
            return text;
        },
        subject() {
            return subject;
        },
    };
}
