import { load as cheerioLoad } from 'cheerio';
import * as meta from './contants';
import { StyleSource } from './css';
import { applyStyles, getFirstMetaValue, getOrderedStyles, removeAttribute, removeCommentNodes, removeElements } from './elements';
import { replacementFactory } from './replacement';
import { serializeHtml } from './serialize';
import { serializeText } from './text';
import textStyles from './text/text-styles';

/**
 * Mail Template Options.
 */
export type MailTplOptions = {
    /**
     * Remove comment nodes? Defaults to true.
     */
    removeComments?: boolean,
    /**
     * Remove 'id' attributes? Defaults to true.
     */
    removeIds?: boolean,
    /**
     * Remove 'class' attributes? Defaults to true.
     */
    removeClasses?: boolean,
    /**
     * Apply default text stylesheet? Defaults to true.
     */
    defaultTextStyles?: boolean,
    /**
     * Trim results? Defaults to true.
     */
    trim?: boolean,
    /**
     * Additional stylesheets to use. Added at top of document.
     */
    styles?: StyleSource[]
    /**
     * Source name.
     */
    source?: string,
    /**
     * Source identity.
     */
    ident?: string,
    /**
     * Name prefix.
     */
    namePrefix?: string
    /**
     * Ident prefix.
     */,
    identPrefix?: string,
    /**
     * Replacement data.
     */
    data?: Readonly<Record<string, string>>,
};

/**
 * Mail Template.
 */
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

/**
 * Build a Mailing Template from a string.
 * @param template The template string.
 * @param options Template options.
 * @returns The Mail Template.
 */
export function buildFromString(template: string, options?: MailTplOptions): MailingTemplate {
    const trim = options?.trim ?? true;
    const removeComments = options?.removeComments ?? true;
    const removeIds = options?.removeIds ?? true;
    const removeClasses = options?.removeClasses ?? true;
    const defaultTextStyles = options?.defaultTextStyles ?? true;
    const contents = trim ? template.trim() : template;
    const namePrefix = options?.namePrefix ?? '';
    const identPrefix = options?.identPrefix ?? '';
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
    const [tryReplace, tryReplaceOptional] = tryReplaceFactory(options?.data);
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
            return name === undefined ? undefined : namePrefix + name;
        },
        ident() {
            return ident === undefined ? undefined : identPrefix + ident;
        },
        fromEmail() {
            return tryReplaceOptional(fromEmail);
        },
        fromName() {
            return tryReplaceOptional(fromName);
        },
        html() {
            return tryReplace(html);
        },
        text() {
            return tryReplace(text);
        },
        subject() {
            return tryReplaceOptional(subject);
        },
    };
}

/**
 * Try Replace function types.
 */
export type TryReplace = (value: string) => string;
export type TryReplaceOptional = (value: string | undefined) => string | undefined;

/**
 * Build replacer functions for string & string|undefined from options.
 * @ignore
 * @param options The mail template options.
 * @returns Tuple of replacer and optional-replacer functions.
 */
function tryReplaceFactory(data?: Record<string, string>): [TryReplace, TryReplaceOptional] {
    let tryReplace: TryReplace;
    if (data) {
        const replacer = replacementFactory();
        tryReplace = (value: string): string => {
            return replacer(value, data);
        };
    } else {
        tryReplace = (value: string): string => {
            return value;
        };
    }
    const tryReplaceOptional = (value: string | undefined): string | undefined => {
        if (value === undefined) {
            return undefined;
        }
        return tryReplace(value);
    };
    return [tryReplace, tryReplaceOptional];
}
