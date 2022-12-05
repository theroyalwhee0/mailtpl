import { Cheerio, CheerioAPI, Element } from 'cheerio';
export declare function processTextTemplate(ele: Cheerio<Element>, value: string | undefined): string;
export declare function serializeText($: CheerioAPI): string;
