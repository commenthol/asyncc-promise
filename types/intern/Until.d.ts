/** @typedef {import('../types').IndexFunction} IndexFunction */
/** @typedef {import('../types').IndexTestFunction} IndexTestFunction */
/** @typedef {import('../types').Resolve} Resolve */
/** @typedef {import('../types').Reject} Reject */
/** @typedef {import('../types').TimesWithLag} TimesWithLag */
export class BaseUntil {
    /**
     * @param {IndexTestFunction} test
     * @param {IndexFunction} task
     * @param {object} opts
     * @param {Resolve} resolve
     * @param {Reject} reject
     */
    constructor(test: IndexTestFunction, task: IndexFunction, opts: object, resolve: Resolve, reject: Reject);
    test: import("../types").IndexTestFunction;
    task: import("../types").IndexFunction;
    opts: any;
    resolve: import("../types").Resolve;
    reject: import("../types").Reject;
    i: number;
    /**
     * @param {Error|null} err
     * @param {any} [res]
     */
    cb(err: Error | null, res?: any): void;
    run(): void;
    init(): void;
}
export class Until extends BaseUntil {
}
export class DoUntil extends Until {
}
export class Times extends BaseUntil {
    /**
     * @param {number} times
     * @param {IndexFunction} task
     * @param {TimesWithLag} opts
     * @param {Resolve} resolve
     * @param {Reject} reject
     */
    constructor(times: number, task: IndexFunction, opts: TimesWithLag, resolve: Resolve, reject: Reject);
    times: number;
}
export class Retry extends Times {
}
export type IndexFunction = import('../types').IndexFunction;
export type IndexTestFunction = import('../types').IndexTestFunction;
export type Resolve = import('../types').Resolve;
export type Reject = import('../types').Reject;
export type TimesWithLag = import('../types').TimesWithLag;
