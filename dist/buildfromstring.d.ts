import { StyleSource } from './css';
export type MailTplOptions = {
    removeComments?: boolean;
    removeIds?: boolean;
    removeClasses?: boolean;
    trim?: boolean;
    styles?: StyleSource[];
    source?: string;
    ident?: string;
};
export type MailingTemplate = {
    source(): string | undefined;
    subject(): string | undefined;
    name(): string | undefined;
    ident(): string | undefined;
    fromEmail(): string | undefined;
    fromName(): string | undefined;
    html(): string;
};
export declare function buildFromString(template: string, options?: MailTplOptions): MailingTemplate;
