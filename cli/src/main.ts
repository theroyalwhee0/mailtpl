import { buildFromString } from '@theroyalwhee0/mailtpl';
import fs from 'node:fs/promises';
import path from 'path';
import { getArgv, WriterChoice } from './argv';
import { FileWriter } from './file/writer';
import { group, tag } from './iter';
import { SparkpostWriter } from './sparkpost/writer';
import { ITemplateWriter } from './writer';

export async function main() {
    const argv = getArgv();
    const namePrefix = argv['name-prefix'] ?? '';
    let writer: ITemplateWriter;
    if (argv.output !== undefined) {
        writer = new FileWriter(argv.output);
    } else if (argv.writer === WriterChoice.Sparkpost) {
        writer = new SparkpostWriter(namePrefix);
    } else {
        throw new Error('No template writer specified.');
    }
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
    // Process HTML files.
    for (const fileName of files.html ?? []) {
        const ident = path.basename(fileName).replace(/\.html?$/, '');
        const content = await fs.readFile(fileName, 'utf8');
        const template = buildFromString(content, {
            styles, ident,
            source: fileName,
        });
        await writer.write(template);
    }
}
