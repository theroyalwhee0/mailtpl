export type Tagger<T> = (value: T) => boolean;
export type Taggers<T> = {
    [key: string]: Tagger<T>;
};
export type Tagged<T> = [
    T,
    string[]
];
export type Grouped<T> = {
    [key: string]: T[];
};
export type IterableTaggedType<R> = R extends Iterable<Tagged<infer T>> ? T : never;
export declare function group<T>(iter: Iterable<Tagged<T>>): Grouped<T>;
export declare function tag<T>(iter: Iterable<T>, taggers: Taggers<T>): Generator<Tagged<T>, void, void>;
