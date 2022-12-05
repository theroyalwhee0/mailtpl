import { MailingTemplate } from '@theroyalwhee0/mailtpl';
import Sparkpost, { ErrorWithDescription } from 'sparkpost';
import { throwIfEmpty } from '../utilities';
import { ITemplateWriter } from '../writer';

export const CODE_TEMPLATE_ALREADY_EXISTS = '3030';
const sleepTime = 100;

function sleep(): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), sleepTime);
    });
}

export class SparkpostWriter implements ITemplateWriter {
    #sparkpost: Sparkpost;

    async setup() {
        const apiKey = process.env.SPARKPOST_API_KEY || '';
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
        const text = template.text();
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
                    const result = await sparkpost.templates.update(id, contents);
                    await sleep();
                    return result;
                }
            }
        }
        throw err;
    }
}