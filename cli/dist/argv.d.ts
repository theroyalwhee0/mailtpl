/**
 * The Processed Argv.
 */
export interface ArgvShape {
    /**
     * General argv values.
     */
    [key: string]: unknown;
    _: (string | number)[];
    $0: string;
    /**
     * List of files to process.
     */
    files: string[];
    /**
     * Output folder path.
     * Only for 'file' writer.
     */
    output: string | undefined;
    /**
     * Add prefix to the template name.
     */
    namePrefix: string | undefined;
    /**
     * Add prefix to the template ident.
     */
    identPrefix: string | undefined;
    /**
     * Template/replacement data.
     */
    data: string;
    /**
     * Output text emails. Default depends on writer.
     */
    text?: boolean;
}
/**
 * Possible writers.
 */
export declare enum WriterChoice {
    File = "file",
    Sparkpost = "sparkpost"
}
/**
 * Get command line argv.
 * @param value The processes argv. Optional.
 * @param exit Allow getArgv to trigger exit. Defaults to true.
 * @returns The processed argv.
 */
export declare function getArgv(value?: string[], exit?: boolean): ArgvShape;
