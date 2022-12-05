import { MailingTemplate } from '@theroyalwhee0/mailtpl';
export interface ITemplateWriter {
    setup(): Promise<void>;
    write(template: MailingTemplate): Promise<void>;
}
export declare function serializeMailingTemplate(template: MailingTemplate): {
    source: string | undefined;
    name: string | undefined;
    ident: string | undefined;
    fromEmail: string | undefined;
    fromName: string | undefined;
    subject: string | undefined;
    html: string;
};
