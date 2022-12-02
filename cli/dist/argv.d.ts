export interface ArgvShape {
    [key: string]: unknown;
    _: (string | number)[];
    $0: string;
    files: string[];
    output: string | undefined;
}
export declare function getArgv(value?: string[], exit?: boolean): ArgvShape;
