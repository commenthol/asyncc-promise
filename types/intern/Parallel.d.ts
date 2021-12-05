/** @typedef {import('../types').IteratorFunction} IteratorFunction */
/** @typedef {import('../types').TaskFunction} TaskFunction */
/** @typedef {import('../types').ParallelOptions} ParallelOptions */
/** @typedef {import('../types').Resolve} Resolve */
/** @typedef {import('../types').Reject} Reject */
export class BaseParallel {
    /**
     * @param {number} limit
     * @param {number} length
     * @param {ParallelOptions} opts
     * @param {Resolve} resolve
     * @param {Reject} reject
     */
    constructor(limit: number, length: number, opts: ParallelOptions, resolve: Resolve, reject: Reject);
    opts: import("../types").ParallelOptions;
    resolve: import("../types").Resolve;
    reject: import("../types").Reject;
    error: AsynccError;
    results: any[];
    done: number;
    i: number;
    l: number;
    length: number;
    limit: number;
    /**
     * @param {number} i
     */
    run(i: number): void;
    cb(j: any, err: any, res: any): void;
    final(errMsg: any): void;
    init(): void;
}
export class EachLimit extends BaseParallel {
    /**
     * @param {number} limit
     * @param {any[]} items
     * @param {IteratorFunction} task
     * @param {ParallelOptions} opts
     * @param {Resolve} resolve
     * @param {Reject} reject
     */
    constructor(limit: number, items: any[], task: IteratorFunction, opts: ParallelOptions, resolve: Resolve, reject: Reject);
    items: any[];
    task: import("../types").IteratorFunction;
}
export class ParallelLimit extends BaseParallel {
    /**
     * @param {number} limit
     * @param {TaskFunction[]} tasks
     * @param {ParallelOptions} opts
     * @param {Resolve} resolve
     * @param {Reject} reject
     */
    constructor(limit: number, tasks: TaskFunction[], opts: ParallelOptions, resolve: Resolve, reject: Reject);
    tasks: import("../types").TaskFunction[];
}
export type IteratorFunction = import('../types').IteratorFunction;
export type TaskFunction = import('../types').TaskFunction;
export type ParallelOptions = import('../types').ParallelOptions;
export type Resolve = import('../types').Resolve;
export type Reject = import('../types').Reject;
import AsynccError from "./AsynccError";
