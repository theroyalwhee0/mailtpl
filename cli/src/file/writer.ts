import { MailingTemplate } from '@theroyalwhee0/mailtpl';
import mkdirp from 'mkdirp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ITemplateWriter } from '../writer';

export class FileWriter implements ITemplateWriter {

    #folder: string;
    #ext: string;

    constructor(folder: string, ext = '.html') {
        this.#folder = path.resolve(folder);
        this.#ext = ext;
    }

    async setup() {
        await mkdirp(this.#folder);
    }

    async write(template: MailingTemplate): Promise<void> {
        const name = template.ident();
        if (!name) {
            throw new Error('Template has no ident to use as a filename.');
        }
        const filePath = path.resolve(this.#folder, name) + this.#ext;
        const html = template.html();
        await fs.writeFile(filePath, html, 'utf8');
    }
}
