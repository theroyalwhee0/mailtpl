"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeText = exports.processTextTemplate = void 0;
const istype_1 = require("@theroyalwhee0/istype");
const domelementtype_1 = require("domelementtype");
const css_property_1 = require("./css-property");
function processTextTemplate(ele, value) {
    if (value === '' || value === undefined) {
        return '';
    }
    let text = '';
    try {
        const parsed = (0, css_property_1.parse)(value);
        for (const statement of parsed) {
            if ((0, istype_1.isString)(statement)) {
                text += statement;
            }
            else if ((0, istype_1.isObject)(statement) && 'attr' in statement) {
                text += ele.attr(statement.attr) || '';
            }
        }
    }
    catch (err) {
        if (err.name === 'SyntaxError') {
            throw new Error(JSON.stringify(value) + ' : ' + err.message);
        }
        else {
            throw err;
        }
    }
    return text;
}
exports.processTextTemplate = processTextTemplate;
function elementsToText($, nodes) {
    let text = '';
    nodes.each((_idx, node) => {
        if (node.type === domelementtype_1.ElementType.Tag) {
            const ele = $(node);
            if (ele.attr('-text-remove') === 'true') {
                return;
            }
            const begin = processTextTemplate(ele, ele.attr('-text-begin'));
            const end = processTextTemplate(ele, ele.attr('-text-end'));
            text += begin;
            text += elementsToText($, ele.contents());
            text += end;
        }
        else if (node.type === domelementtype_1.ElementType.Text) {
            text += node.data.replace(/\s+/g, ' ');
        }
        else {
            console.log('@@@@ node.type', node.type);
        }
    });
    return text;
}
function serializeText($) {
    return elementsToText($, $.root().contents());
}
exports.serializeText = serializeText;
//# sourceMappingURL=index.js.map