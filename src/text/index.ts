import { isObject, isString } from '@theroyalwhee0/istype';
import { AnyNode, Cheerio, CheerioAPI, Element } from 'cheerio';
import { ElementType } from 'domelementtype';
import { parse, ParseAttr } from './css-property';

export function processTextTemplate(ele: Cheerio<Element>, value: string | undefined): string {
    if (value === '' || value === undefined) {
        return '';
    }
    let text = '';
    try {
        const parsed = parse(value);
        for (const statement of parsed) {
            if (isString(statement)) {
                text += statement;
            } else if (isObject<ParseAttr>(statement) && 'attr' in statement) {
                text += ele.attr(statement.attr) || '';
            }
        }
    } catch (err) {
        if (err.name === 'SyntaxError') {
            throw new Error(JSON.stringify(value) + ' : ' + err.message);
        } else {
            throw err;
        }
    }
    return text;
}

function elementsToText($: CheerioAPI, nodes: Cheerio<AnyNode>): string {
    let text = '';
    nodes.each((_idx, node) => {
        if (node.type === ElementType.Tag) {
            const ele = $(node);
            if (ele.attr('-text-remove') === 'true') {
                return;
            }
            const begin = processTextTemplate(ele, ele.attr('-text-begin'));
            const end = processTextTemplate(ele, ele.attr('-text-end'));
            text += begin;
            text += elementsToText($, ele.contents());
            text += end;
        } else if (node.type === ElementType.Text) {
            text += node.data.replace(/\s+/g, ' '); // Replace whitespace with single space.
        }
    });
    text = text
        .replace(/\n +/gm, '\n')    // Trim line starts.
        .replace(/^\n+/g, '')      // Remove leading newlines.
        .replace(/\n{2,}/g, '\n\n')   // Replace 2+ newlines with a single newline.
        ;
    return text;
}

export function serializeText($: CheerioAPI) {
    return elementsToText($, $.root().contents());
}
