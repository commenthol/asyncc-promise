import allSettledLimit from './allSettledLimit'

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
 *   () => Promise.resolve(1), // NOTE: wrap the Promise into a function to defer execution
 *   () => Promise.resolve(3),
 *   async () => 5
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
 *   async () => throw new Error(5)
 * ], {timeout: 100}).then((result) => {
 *   console.log(results)
 *   //> [{status: 'rejected', value: Error(1)},
 *   //>  {status: 'fullfilled', value: 3},
 *   //>  {status: 'rejected', reason: Error(5)}]
 * })
 */
export default function allSettled (tasks, options) {
  return allSettledLimit(0, tasks, options)
}
