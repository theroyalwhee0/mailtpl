import fs from 'node:fs/promises';
import { getTypeOf } from '@theroyalwhee0/istype';

export function throwIfEmpty(values: Record<string, unknown>) {
    for (const [key, value] of Object.entries(values)) {
        if (value === undefined || value === '' || value === null) {
            throw new Error(`"${key}" is required but empty: "${value}" [${getTypeOf(value)}]`);
        }
    }
}

export async function loadJSON(fileName: string): Promise<Record<string, string>> {
    const content = await fs.readFile(fileName, 'utf8');
    const data: Record<string, string> = JSON.parse(content);
    return data;
}