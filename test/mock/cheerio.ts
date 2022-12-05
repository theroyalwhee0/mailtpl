import { Element, Cheerio, load } from 'cheerio';

const defaultContent = '<span></span>';

export function mockCheerioElement(content = defaultContent): Cheerio<Element> {
    const $ = load(content, null, false);
    return $.root().find('*').first();
}
