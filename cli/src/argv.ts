import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export interface ArgvShape {
    [key: string]: unknown;
    _: (string | number)[];
    $0: string;
    files: string[];
    output: string | undefined
    'name-prefix': string | undefined,
}

export enum WriterChoice {
    File = 'file',
    Sparkpost = 'sparkpost'
}

export function getArgv(value?: string[], exit = true): ArgvShape {
    value = value ?? process.argv;
    return yargs(hideBin(value))
        .scriptName('mailtpl')
        .command(
            '$0 [options] <files..>',
            'Compile the source files.', (yargs) => {
                return yargs.positional('files', {
                    describe: 'Source files to process. May include CSS files.',
                }).option('name-prefix', {
                    describe: 'Add the prefix to template names.',
                    type: 'string',
                }).option('output', {
                    alias: 'o',
                    describe: 'Output results as files to specified folder.',
                    type: 'string',
                }).option('writer', {
                    alias: 'w',
                    describe: 'Select a template writer.',
                    choices: [WriterChoice.File, WriterChoice.Sparkpost],
                });
            })
        .demandCommand(1)
        .help()
        .alias('h', 'help')
        .exitProcess(exit)
        .strict()
        .parseSync() as ArgvShape;
}
