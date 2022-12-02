import { MailingTemplate } from "@theroyalwhee0/mailtpl";
import fs from 'node:fs/promises';
import path from "node:path";
import { ITemplateWriter } from "../writer";
import mkdirp from 'mkdirp';

export class FileWriter implements ITemplateWriter {

    #folder: string;

    constructor(folder: string) {
        this.#folder = path.resolve(folder);
    }

    async setup() {
        await mkdirp(this.#folder);
    }

    async write(template: MailingTemplate): Promise<void> {
        const filePath = path.resolve(this.#folder, 'filename.html');
        const html = template.html();
        await fs.writeFile(filePath, html, 'utf8');
    }
}
