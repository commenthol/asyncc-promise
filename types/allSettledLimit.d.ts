/** @typedef {import('./types').TaskFunction} TaskFunction */
/** @typedef {import('./types').ParallelOptions} ParallelOptions */
/** @typedef {import('./types').Status} Status */
/**
 * Run `tasks` returning Promises in parallel limited to `limit` parallel
 * running tasks.
 *
 * Consider using this function in case of opening a huge amout of parallel IO
 * like filehandlers or sockets. Remember those resources are limited!
 *
 * Does not stop parallel execution on errors. *All tasks get executed.*
 * `then()` gets called after the longest running task finishes.
 *
 * If bail-out on first error is desired, consider set `{bail: true}` as option.
 *
 * @name allSettledLimit
 * @memberOf module:parallel
 * @static
 * @method
 * @param {Number} limit - number of tasks running in parallel
 * @param {TaskFunction[]} tasks - Array of functions of type `() => Promise`
 * @param {ParallelOptions} [options]
 * @return {Promise<Status[]>} on resolve `.then(results: Array<Object> => {})` where Object equals
 *   `{status: 'fullfiled', value: <any>}` or
 *   `{status: 'rejected', reason: <Error>}`
 *
 * @example <caption>without errors - runs 2 tasks in parallel</caption>
 * allSettledLimit(2, [
 *   () => Promise.resolve(1), // NOTE to wrap the Promise into a function
 *   () => Promise.resolve(3),
 *   () => Promise.resolve(5)
 * ]).then((results) => {
 *   console.log(results)
 *   //> [{status: 'fullfilled', value: 1},
 *   //>  {status: 'fullfilled', value: 3},
 *   //>  {status: 'fullfileld', value: 5}]
 * })
 *
 * @example <caption>with errors and timeout = 100ms</caption>
 * allSettledLimit(2, [
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
export default function allSettledLimit(limit: number, tasks: TaskFunction[], options?: import("./types").ParallelOptions | undefined): Promise<Status[]>;
export type TaskFunction = import('./types').TaskFunction;
export type ParallelOptions = import('./types').ParallelOptions;
export type Status = import('./types').Status;
