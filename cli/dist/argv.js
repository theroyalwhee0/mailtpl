"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArgv = exports.WriterChoice = void 0;
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
var WriterChoice;
(function (WriterChoice) {
    WriterChoice["File"] = "file";
    WriterChoice["Sparkpost"] = "sparkpost";
})(WriterChoice = exports.WriterChoice || (exports.WriterChoice = {}));
function getArgv(value, exit = true) {
    value = value ?? process.argv;
    return (0, yargs_1.default)((0, helpers_1.hideBin)(value))
        .scriptName('mailtpl')
        .command('$0 [options] <files..>', 'Compile the source files.', (yargs) => {
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
        });
    })
        .demandCommand(1)
        .help()
        .alias('h', 'help')
        .exitProcess(exit)
        .strict()
        .parseSync();
}
exports.getArgv = getArgv;
//# sourceMappingURL=argv.js.map