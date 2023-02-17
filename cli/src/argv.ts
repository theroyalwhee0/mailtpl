import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

/**
 * The Processed Argv.
 */
export interface ArgvShape {
    /**
     * General argv values.
     */
    [key: string]: unknown;
    _: (string | number)[];
    $0: string;
    /**
     * List of files to process.
     */
    files: string[];
    /**
     * Output folder path.
     * Only for 'file' writer.
     */
    output: string | undefined
    /**
     * Add prefix to the template name.
     */
    namePrefix: string | undefined,
    /**
     * Add prefix to the template ident.
     */
    identPrefix: string | undefined,
    /**
     * Template/replacement data.
     */
    data: string,
    /**
     * Output text emails. Default depends on writer.
     */
    text?: boolean,
}

/**
 * Possible writers.
 */
export enum WriterChoice {
    File = 'file',
    Sparkpost = 'sparkpost'
}

/**
 * Get command line argv.
 * @param value The processes argv. Optional.
 * @param exit Allow getArgv to trigger exit. Defaults to true.
 * @returns The processed argv.
 */
export function getArgv(value?: string[], exit = true): ArgvShape {
    value = value ?? process.argv;
    return yargs(hideBin(value))
        .scriptName('mailtpl')
        .command(
            '$0 [options] <files..>',
            'Compile the source files.', (yargs) => {
                return yargs.positional('files', {
                    describe: 'Source files to process. May include CSS files.',
                }).option('output', {
                    alias: 'o',
                    describe: 'Output results as files to specified folder.',
                    type: 'string',
                }).option('writer', {
                    alias: 'w',
                    describe: 'Select a template writer.',
                    choices: [WriterChoice.File, WriterChoice.Sparkpost],
                }).option('name-prefix', {
                    describe: 'Add the prefix to template names.',
                    type: 'string',
                }).option('ident-prefix', {
                    describe: 'Add the prefix to template ident.',
                    type: 'string',
                }).option('data', {
                    describe: 'File to load template data from.',
                    type: 'string',
                }).option('text', {
                    describe: 'Output text emails. Default depends on writer.',
                    type: 'boolean',
                });
            })
        .demandCommand(1)
        .help()
        .alias('h', 'help')
        .exitProcess(exit)
        .strict()
        .parseSync() as ArgvShape;
}
