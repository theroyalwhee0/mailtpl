import { MailingTemplate } from '@theroyalwhee0/mailtpl';
import { ITemplateWriter } from '../writer';
/**
 * Code returned when a template already exists.
 */
export declare const CODE_TEMPLATE_ALREADY_EXISTS = "3030";
export type SparkpostWriterOptions = {
    outputText?: boolean;
};
export declare class SparkpostWriter implements ITemplateWriter {
    #private;
    constructor(options?: SparkpostWriterOptions);
    setup(): Promise<void>;
    write(template: MailingTemplate): Promise<void>;
}
