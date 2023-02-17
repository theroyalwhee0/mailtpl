import { isString } from '@theroyalwhee0/istype';
import { MailingTemplate } from '@theroyalwhee0/mailtpl';
import Sparkpost, { ErrorWithDescription } from 'sparkpost';
import { throwIfEmpty } from '../utilities';
import { ITemplateWriter } from '../writer';

/**
 * Code returned when a template already exists.
 */
export const CODE_TEMPLATE_ALREADY_EXISTS = '3030';

/**
 * The amount of time to sleep in ms.
 */
const sleepTime = 100;

/**
 * Sleep to prevent overuse of API.
 */
function sleep(): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), sleepTime);
    });
}

export type SparkpostWriterOptions = {
    outputText?: boolean
};

export class SparkpostWriter implements ITemplateWriter {
    #outputText: boolean;
    #sparkpost: Sparkpost;

    constructor(options?: SparkpostWriterOptions) {
        this.#outputText = options?.outputText ?? true;
    }

    async setup() {
        let apiKey = process.env.SPARKPOST_APIKEY ?? '';
        if (!apiKey && isString(process.env.SPARKPOST_API_KEY)) {
            // NOTE: SPARKPOST_API_KEY is deprecated.
            console.warn('! "SPARKPOST_API_KEY" is deprecated, please use "SPARKPOST_APIKEY"');
            apiKey = process.env.SPARKPOST_API_KEY;
        }
        if (!apiKey) {
            throw new Error('SPARKPOST_APIKEY is required.');
        }
        this.#sparkpost = new Sparkpost(apiKey);
    }

    async write(template: MailingTemplate): Promise<void> {
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
        const text = this.#outputText ? template.text() : '';
        throwIfEmpty({ fromName, fromEmail, subject, id, name });
        try {
            const contents: Sparkpost.CreateTemplate = {
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
            await sparkpostUpsert(this.#sparkpost, contents);
        } catch (err) {
            if (err.name === 'SparkPostError') {
                const error: ErrorWithDescription | undefined = err.errors?.[0];
                if (error) {
                    throw new Error(`${error.message}: ${error.description} [${error.code}]`);
                }
            }
            throw err;
        }
    }
}

async function sparkpostUpsert(sparkpost: Sparkpost, contents: Sparkpost.CreateTemplate) {
    try {
        const result = await sparkpost.templates.create(contents);
        await sleep();
        return result;
    } catch (err) {
        if (err.name === 'SparkPostError') {
            const error: ErrorWithDescription | undefined = err.errors?.[0];
            if (error) {
                if (error.code === CODE_TEMPLATE_ALREADY_EXISTS) {
                    const id = contents.id as string;
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