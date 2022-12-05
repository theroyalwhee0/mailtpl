export declare type ParseAttr = {
    attr: string
}
export declare type ParseStatement = string | ParseAttr

export declare type ParseResult = ParseStatement[]

declare function parse(input: string): ParseResult;

declare class SyntaxError extends Error {
    readonly expected: string;
    readonly found: string;
    readonly location: string;
    readonly name: 'SyntaxError';
    constructor(message: string, expected: string, found: string, location: string)
}

export {
    SyntaxError,
    parse,
};