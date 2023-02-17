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
var _SparkpostWriter_outputText, _SparkpostWriter_sparkpost;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SparkpostWriter = exports.CODE_TEMPLATE_ALREADY_EXISTS = void 0;
const istype_1 = require("@theroyalwhee0/istype");
const sparkpost_1 = __importDefault(require("sparkpost"));
const utilities_1 = require("../utilities");
/**
 * Code returned when a template already exists.
 */
exports.CODE_TEMPLATE_ALREADY_EXISTS = '3030';
/**
 * The amount of time to sleep in ms.
 */
const sleepTime = 100;
/**
 * Sleep to prevent overuse of API.
 */
function sleep() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), sleepTime);
    });
}
class SparkpostWriter {
    constructor(options) {
        _SparkpostWriter_outputText.set(this, void 0);
        _SparkpostWriter_sparkpost.set(this, void 0);
        __classPrivateFieldSet(this, _SparkpostWriter_outputText, options?.outputText ?? true, "f");
    }
    async setup() {
        let apiKey = process.env.SPARKPOST_APIKEY ?? '';
        if (!apiKey && (0, istype_1.isString)(process.env.SPARKPOST_API_KEY)) {
            // NOTE: SPARKPOST_API_KEY is deprecated.
            console.warn('! "SPARKPOST_API_KEY" is deprecated, please use "SPARKPOST_APIKEY"');
            apiKey = process.env.SPARKPOST_API_KEY;
        }
        if (!apiKey) {
            throw new Error('SPARKPOST_APIKEY is required.');
        }
        __classPrivateFieldSet(this, _SparkpostWriter_sparkpost, new sparkpost_1.default(apiKey), "f");
    }
    async write(template) {
        const transactional = true;
        const open_tracking = false;
        const click_tracking = false;
        const published = true;
        const id = template.ident() ?? '';
        const name = template.name() ?? '';
        const fromName = template.fromName() ?? '';
        const fromEmail = template.fromEmail() ?? '';
        const subject = template.subject() ?? '';
        const html = template.html();
        const text = __classPrivateFieldGet(this, _SparkpostWriter_outputText, "f") ? template.text() : '';
        (0, utilities_1.throwIfEmpty)({ fromName, fromEmail, subject, id, name });
        try {
            const contents = {
                id, name, published,
                options: {
                    open_tracking,
                    click_tracking,
                    transactional,
                },
                content: {
                    subject, html, text,
                    from: {
                        email: fromEmail,
                        name: fromName,
                    },
                },
            };
            await sparkpostUpsert(__classPrivateFieldGet(this, _SparkpostWriter_sparkpost, "f"), contents);
        }
        catch (err) {
            if (err.name === 'SparkPostError') {
                const error = err.errors?.[0];
                if (error) {
                    throw new Error(`${error.message}: ${error.description} [${error.code}]`);
                }
            }
            throw err;
        }
    }
}
exports.SparkpostWriter = SparkpostWriter;
_SparkpostWriter_outputText = new WeakMap(), _SparkpostWriter_sparkpost = new WeakMap();
async function sparkpostUpsert(sparkpost, contents) {
    try {
        const result = await sparkpost.templates.create(contents);
        await sleep();
        return result;
    }
    catch (err) {
        if (err.name === 'SparkPostError') {
            const error = err.errors?.[0];
            if (error) {
                if (error.code === exports.CODE_TEMPLATE_ALREADY_EXISTS) {
                    const id = contents.id;
                    const result = await sparkpost.templates.update(id, contents, {
                        update_published: true,
                    });
                    await sleep();
                    return result;
                }
            }
        }
        throw err;
    }
}
//# sourceMappingURL=writer.js.map