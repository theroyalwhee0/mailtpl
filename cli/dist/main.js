"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const dotenv = __importStar(require("dotenv"));
const mailtpl_1 = require("@theroyalwhee0/mailtpl");
const promises_1 = __importDefault(require("node:fs/promises"));
const path_1 = __importDefault(require("path"));
const argv_1 = require("./argv");
const writer_1 = require("./file/writer");
const iter_1 = require("./iter");
const writer_2 = require("./sparkpost/writer");
async function main() {
    dotenv.config();
    const argv = (0, argv_1.getArgv)();
    let writer;
    if (argv.output !== undefined) {
        writer = new writer_1.FileWriter(argv.output);
    }
    else if (argv.writer === argv_1.WriterChoice.Sparkpost) {
        writer = new writer_2.SparkpostWriter();
    }
    else {
        throw new Error('No template writer specified.');
    }
    // Group source files.
    const files = (0, iter_1.group)((0, iter_1.tag)(argv.files ?? [], {
        css: (value) => /\.css$/.test(value),
        html: (value) => /\.html?$/.test(value),
    }));
    // Load CSS files.
    const styles = [];
    for (const fileName of files.css ?? []) {
        const content = await promises_1.default.readFile(fileName, 'utf8');
        styles.push(content);
    }
    // Setup writer.
    await writer.setup();
    // Process HTML files.
    for (const fileName of files.html ?? []) {
        const ident = path_1.default.basename(fileName).replace(/\.html?$/, '');
        const content = await promises_1.default.readFile(fileName, 'utf8');
        const template = (0, mailtpl_1.buildFromString)(content, {
            styles, ident,
            source: fileName,
        });
        await writer.write(template);
    }
}
exports.main = main;
//# sourceMappingURL=main.js.map