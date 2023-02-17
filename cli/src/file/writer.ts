import { MailingTemplate } from '@theroyalwhee0/mailtpl';
import mkdirp from 'mkdirp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ITemplateWriter } from '../writer';

const dotHtml = '.html';
const dotText = '.txt';

export type FileWriterOptions = {
    folder: string,
    html?: string,
    text?: string,
    outputText?: boolean
};

export class FileWriter implements ITemplateWriter {

    #folder: string;
    #html: string;
    #text: string;
    #outputText: boolean;

    constructor(options: FileWriterOptions) {
        this.#folder = path.resolve(options.folder);
        this.#html = options.html ?? dotHtml;
        this.#text = options.text ?? dotText;
        this.#outputText = options.outputText ?? false;
    }

    async setup() {
        await mkdirp(this.#folder);
    }

    async write(template: MailingTemplate): Promise<void> {
        const name = template.ident();
        if (!name) {
            throw new Error('Template has no ident to use as a filename.');
        }
        const htmlPath = path.resolve(this.#folder, name) + this.#html;
        const html = template.html();
        await fs.writeFile(htmlPath, html, 'utf8');
        if (this.#outputText) {
            const textPath = path.resolve(this.#folder, name) + this.#text;
            const text = template.text();
            await fs.writeFile(textPath, text, 'utf8');
        }
    }
}
