import { MailingTemplate } from "@theroyalwhee0/mailtpl";
import { ITemplateWriter } from "../writer";
export declare class FileWriter implements ITemplateWriter {
    #private;
    constructor(folder: string, ext?: string);
    setup(): Promise<void>;
    write(template: MailingTemplate): Promise<void>;
}
