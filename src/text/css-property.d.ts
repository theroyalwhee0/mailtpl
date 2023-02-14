/**
 * These declarations are for src/text/css-property.js which is generated
 * from src/text/css-property.pegjs using Peggy (https://peggyjs.org/).
 * 
 * Any changes to src/text/css-property.js will be overwritten.
 */

/**
 * Parse Attribute.
 */
export declare type ParseAttr = {
    attr: string
}

/**
 * Parse Statement.
 */
export declare type ParseStatement = string | ParseAttr

/**
 * Parse Result.
 */
export declare type ParseResult = ParseStatement[]

/**
 * Parse CSS property value.
 * @param input The property to parse.
 */
declare function parse(input: string): ParseResult;

/**
 * Parse Syntax Error.
 */
declare class SyntaxError extends Error {
    readonly expected: string;
    readonly found: string;
    readonly location: string;
    readonly name: 'SyntaxError';
    constructor(message: string, expected: string, found: string, location: string)
}

/**
 * Exports.
 */
export {
    SyntaxError,
    parse,
};
