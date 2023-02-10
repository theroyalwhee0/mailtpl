import { MailingTemplate } from '@theroyalwhee0/mailtpl';
import { ITemplateWriter } from '../writer';
export declare const CODE_TEMPLATE_ALREADY_EXISTS = "3030";
export declare class SparkpostWriter implements ITemplateWriter {
    #private;
    constructor(namePrefix?: string);
    setup(): Promise<void>;
    write(template: MailingTemplate): Promise<void>;
}
