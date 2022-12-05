import { getTypeOf } from '@theroyalwhee0/istype';

export function throwIfEmpty(values: Record<string, unknown>) {
    for (const [key, value] of Object.entries(values)) {
        if (value === undefined || value === '' || value === null) {
            throw new Error(`"${key}" is required but empty: "${value}" [${getTypeOf(value)}]`);
        }
    }
}