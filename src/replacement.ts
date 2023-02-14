export type NotFoundAction = 'throw'; // 'blank' | 'throw' | 'ignore';

/**
 * Replacement Factory Options.
 */
export type ReplacementFactoryOptions = {
    /**
     * Replacement pattern.
     * Defaults to '#\{([a-zA-Z0-9_]+)\}'
     */
    pattern?: string,
    /**
     * Action to take if key is not found in data.
     * Defaults to 'throw',
     */
    notFound?: NotFoundAction,
};

/**
 * Replacement factory.
 * @ignore
 * @param options Options for replacement.
 * @returns A replacement function.
 */
export function replacementFactory(options?: ReplacementFactoryOptions) {
    const pattern = options?.pattern ?? '\\$\\$([a-zA-Z0-9_]+)\\$\\$';
    const notFound: NotFoundAction = options?.notFound ?? 'throw';
    const re = new RegExp(pattern, 'g');
    return function replacer(value: string, data: Record<string, string>): string {
        return value.replace(re, (match: string, key: string): string => {
            if (key in data) {
                return data[key];
            }
            switch (notFound) {
                // case 'blank': {
                //     return '';
                // }
                // case 'ignore': {
                //     return match;
                // }
                case 'throw': {
                    throw new Error(`replacement failed: data does not have key "${key}"`);
                }
            }
        });
    };
}