export type Tagger<T> = (value: T) => boolean;

export type Taggers<T> = {
    [key: string]: Tagger<T>
}

export type Tagged<T> = [
    T, string[]
];

export type Grouped<T> = {
    [key: string]: T[],
}

export type IterableTaggedType<R> = R extends Iterable<Tagged<infer T>> ? T : never;

export function group<T>(iter: Iterable<Tagged<T>>): Grouped<T> {
    const grouped: Grouped<T> = {};
    for (const tagged of iter) {
        const [value, tags] = tagged;
        for (const tag of tags) {
            grouped[tag] = grouped[tag] ?? [];
            grouped[tag].push(value);
        }
    }
    return grouped;
}

export function* tag<T>(iter: Iterable<T>, taggers: Taggers<T>): Generator<Tagged<T>, void, void> {
    for (const value of iter) {
        const tags: string[] = [];
        for (const name in taggers) {
            if (taggers[name](value) === true) {
                tags.push(name);
            }
        }
        yield [value, tags];
    }
}