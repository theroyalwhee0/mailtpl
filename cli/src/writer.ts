import { MailingTemplate } from '@theroyalwhee0/mailtpl';

export interface ITemplateWriter {
    setup(): Promise<void>
    write(template: MailingTemplate): Promise<void>
}

export function serializeMailingTemplate(template: MailingTemplate) {
    const name = template.name();
    const ident = template.ident();
    const subject = template.subject();
    const source = template.source();
    const fromEmail = template.fromEmail();
    const fromName = template.fromName();
    const html = template.html();
    return {
        source,
        name,
        ident,
        fromEmail,
        fromName,
        subject,
        html,
    };
}