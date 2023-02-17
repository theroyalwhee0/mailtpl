import { MailingTemplate } from '@theroyalwhee0/mailtpl';
import { ITemplateWriter } from '../writer';
export type FileWriterOptions = {
    folder: string;
    html?: string;
    text?: string;
    outputText?: boolean;
};
export declare class FileWriter implements ITemplateWriter {
    #private;
    constructor(options: FileWriterOptions);
    setup(): Promise<void>;
    write(template: MailingTemplate): Promise<void>;
}
