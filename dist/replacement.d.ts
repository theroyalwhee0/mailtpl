export type NotFoundAction = 'throw';
/**
 * Replacement Factory Options.
 */
export type ReplacementFactoryOptions = {
    /**
     * Replacement pattern.
     * Defaults to '#\{([a-zA-Z0-9_]+)\}'
     */
    pattern?: string;
    /**
     * Action to take if key is not found in data.
     * Defaults to 'throw',
     */
    notFound?: NotFoundAction;
};
/**
 * Replacement factory.
 * @ignore
 * @param options Options for replacement.
 * @returns A replacement function.
 */
export declare function replacementFactory(options?: ReplacementFactoryOptions): (value: string, data: Record<string, string>) => string;
