/** @typedef {import('./types').TaskFunction} TaskFunction */
/** @typedef {import('./types').ParallelOptions} ParallelOptions */
/** @typedef {import('./types').Status} Status */
/**
 * Run `tasks` returning Promises in parallel
 *
 * Does not stop parallel execution on errors. *All tasks get executed.*
 * `then()` gets called after the longest running task finishes.
 *
 * If bail-out on first error is desired, consider set `{bail: true}` as option.
 *
 * @name allSettled
 * @memberOf module:parallel
 * @static
 * @method
 * @param {TaskFunction[]} tasks - Array of functions of type `() => Promise`
 * @param {ParallelOptions} [options]
 * @return {Promise<Status[]>} on resolve `.then(results: Array<Object> => {})` where Object equals `{status: 'fullfiled', value: <any>}` or `{status: 'rejected', reason: <Error>}
 * @example <caption>without errors</caption>
 * allSettled([
 *   () => Promise.resolve(1), // NOTE to wrap the Promise into a function
 *   () => Promise.resolve(3),
 *   () => Promise.resolve(5)
 * ]).then((results) => {
 *   console.log(results)
 *   //> [{status: 'fullfilled', value: 1},
 *   //>  {status: 'fullfilled', value: 3},
 *   //>  {status: 'fullfileld', value: 5}]
 * })
 * @example <caption>with errors and timeout = 100ms</caption>
 * allSettled([
 *   () => Promise.reject(new Error(1)),
 *   () => Promise.resolve(3),
 *   () => Promise.reject(new Error(5))
 * ], {timeout: 100}).then((result) => {
 *   console.log(results)
 *   //> [{status: 'rejected', value: Error(1)},
 *   //>  {status: 'fullfilled', value: 3},
 *   //>  {status: 'rejected', reason: Error(5)}]
 * })
 */
export default function allSettled(tasks: TaskFunction[], options?: import("./types").ParallelOptions | undefined): Promise<Status[]>;
export type TaskFunction = import('./types').TaskFunction;
export type ParallelOptions = import('./types').ParallelOptions;
export type Status = import('./types').Status;
