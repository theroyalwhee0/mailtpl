import { StyleSource } from './css';
export type MailTplOptions = {
    removeComments?: boolean;
    removeIds?: boolean;
    removeClasses?: boolean;
    trim?: boolean;
    styles?: StyleSource[];
};
export type MailingTemplate = {
    subject(): string | undefined;
    html(): string;
};
export declare function buildFromString(template: string, options?: MailTplOptions): MailingTemplate;
