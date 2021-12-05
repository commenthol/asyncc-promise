/** @typedef {import('../types').IteratorFunction} IteratorFunction */
/** @typedef {import('../types').TaskFunction} TaskFunction */
/** @typedef {import('../types').Resolve} Resolve */
/** @typedef {import('../types').Reject} Reject */
export class BaseSeries {
    /**
     * @param {number} length
     * @param {Resolve} resolve
     * @param {Reject} reject
     */
    constructor(length: number, resolve: Resolve, reject: Reject);
    length: number;
    resolve: import("../types").Resolve;
    reject: import("../types").Reject;
    results: any[];
    i: number;
    /**
     * @param {Error|null} err
     * @param {any} [res]
     */
    cb(err: Error | null, res?: any): void;
    run(): void;
}
export class EachSeries extends BaseSeries {
    /**
     * @param {any[]} items
     * @param {IteratorFunction} task
     * @param {Resolve} resolve
     * @param {Reject} reject
     */
    constructor(items: any[], task: IteratorFunction, resolve: Resolve, reject: Reject);
    items: any[];
    task: import("../types").IteratorFunction;
}
export class Series extends BaseSeries {
    /**
     * @param {TaskFunction[]} tasks
     * @param {Resolve} resolve
     * @param {Reject} reject
     */
    constructor(tasks: TaskFunction[], resolve: Resolve, reject: Reject);
    tasks: import("../types").TaskFunction[];
}
export class Compose extends Series {
}
export type IteratorFunction = import('../types').IteratorFunction;
export type TaskFunction = import('../types').TaskFunction;
export type Resolve = import('../types').Resolve;
export type Reject = import('../types').Reject;
