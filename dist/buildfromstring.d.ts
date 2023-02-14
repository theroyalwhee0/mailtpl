import { StyleSource } from './css';
/**
 * Mail Template Options.
 */
export type MailTplOptions = {
    /**
     * Remove comment nodes? Defaults to true.
     */
    removeComments?: boolean;
    /**
     * Remove 'id' attributes? Defaults to true.
     */
    removeIds?: boolean;
    /**
     * Remove 'class' attributes? Defaults to true.
     */
    removeClasses?: boolean;
    /**
     * Apply default text stylesheet? Defaults to true.
     */
    defaultTextStyles?: boolean;
    /**
     * Trim results? Defaults to true.
     */
    trim?: boolean;
    /**
     * Additional stylesheets to use. Added at top of document.
     */
    styles?: StyleSource[];
    /**
     * Source name.
     */
    source?: string;
    /**
     * Source identity.
     */
    ident?: string;
};
/**
 * Mail Template.
 */
export type MailingTemplate = {
    source(): string | undefined;
    subject(): string | undefined;
    name(): string | undefined;
    ident(): string | undefined;
    fromEmail(): string | undefined;
    fromName(): string | undefined;
    html(): string;
    text(): string;
};
/**
 * Build a Mailing Template from a string.
 * @param template The template string.
 * @param options Template options.
 * @returns The Mail Template.
 */
export declare function buildFromString(template: string, options?: MailTplOptions): MailingTemplate;
