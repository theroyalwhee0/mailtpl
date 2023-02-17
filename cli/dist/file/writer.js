"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _FileWriter_folder, _FileWriter_html, _FileWriter_text, _FileWriter_outputText;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileWriter = void 0;
const mkdirp_1 = __importDefault(require("mkdirp"));
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const dotHtml = '.html';
const dotText = '.txt';
class FileWriter {
    constructor(options) {
        _FileWriter_folder.set(this, void 0);
        _FileWriter_html.set(this, void 0);
        _FileWriter_text.set(this, void 0);
        _FileWriter_outputText.set(this, void 0);
        __classPrivateFieldSet(this, _FileWriter_folder, node_path_1.default.resolve(options.folder), "f");
        __classPrivateFieldSet(this, _FileWriter_html, options.html ?? dotHtml, "f");
        __classPrivateFieldSet(this, _FileWriter_text, options.text ?? dotText, "f");
        __classPrivateFieldSet(this, _FileWriter_outputText, options.outputText ?? false, "f");
    }
    async setup() {
        await (0, mkdirp_1.default)(__classPrivateFieldGet(this, _FileWriter_folder, "f"));
    }
    async write(template) {
        const name = template.ident();
        if (!name) {
            throw new Error('Template has no ident to use as a filename.');
        }
        const htmlPath = node_path_1.default.resolve(__classPrivateFieldGet(this, _FileWriter_folder, "f"), name) + __classPrivateFieldGet(this, _FileWriter_html, "f");
        const html = template.html();
        await promises_1.default.writeFile(htmlPath, html, 'utf8');
        if (__classPrivateFieldGet(this, _FileWriter_outputText, "f")) {
            const textPath = node_path_1.default.resolve(__classPrivateFieldGet(this, _FileWriter_folder, "f"), name) + __classPrivateFieldGet(this, _FileWriter_text, "f");
            const text = template.text();
            await promises_1.default.writeFile(textPath, text, 'utf8');
        }
    }
}
exports.FileWriter = FileWriter;
_FileWriter_folder = new WeakMap(), _FileWriter_html = new WeakMap(), _FileWriter_text = new WeakMap(), _FileWriter_outputText = new WeakMap();
//# sourceMappingURL=writer.js.map