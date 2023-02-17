import { buildFromString } from '@theroyalwhee0/mailtpl';
import * as dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'path';
import { getArgv, WriterChoice } from './argv';
import { FileWriter } from './file/writer';
import { group, tag } from './iter';
import { SparkpostWriter } from './sparkpost/writer';
import { loadJSON } from './utilities';
import { ITemplateWriter } from './writer';

export async function main() {
    console.log('[Mail Template]');
    dotenv.config();
    const argv = getArgv();
    const namePrefix = argv.namePrefix;
    const identPrefix = argv.identPrefix;
    const outputText = argv.text;
    let writer: ITemplateWriter;
    let writerName = 'unknown';
    if (argv.output !== undefined) {
        writer = new FileWriter({
            folder: argv.output,
            outputText,
        });
        writerName = WriterChoice.File;
    } else if (argv.writer === WriterChoice.Sparkpost) {
        writer = new SparkpostWriter({
            outputText,
        });
        writerName = WriterChoice.Sparkpost;
    } else {
        throw new Error('No template writer specified.');
    }
    console.log(`> Using "${writerName}" writer`);
    // Group source files.
    const files = group(tag(argv.files ?? [], {
        css: (value: string) => /\.css$/.test(value),
        html: (value: string) => /\.html?$/.test(value),
    }));
    // Load CSS files.
    const styles: string[] = [];
    for (const fileName of files.css ?? []) {
        const content = await fs.readFile(fileName, 'utf8');
        styles.push(content);
    }
    // Setup writer.
    await writer.setup();
    const htmlFiles = files.html ?? [];
    console.log(`> Processing ${htmlFiles.length} HTML files.`);
    // Load replacement/template data.
    let data: Record<string, string> | undefined = undefined;
    if (argv.data) {
        data = await loadJSON(argv.data);
    }
    // Process HTML files.
    for (const fileName of htmlFiles) {
        const ident = path.basename(fileName).replace(/\.html?$/, '');
        const content = await fs.readFile(fileName, 'utf8');
        try {
            const template = buildFromString(content, {
                styles, ident,
                source: fileName,
                namePrefix,
                identPrefix,
                data,
            });
            await writer.write(template);
        } catch (err) {
            console.error(err);
        }
    }
    console.log('> Done');
}
