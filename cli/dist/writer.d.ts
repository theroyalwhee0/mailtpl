import { MailingTemplate } from "@theroyalwhee0/mailtpl";
export interface ITemplateWriter {
    setup(): Promise<void>;
    write(template: MailingTemplate): Promise<void>;
}
