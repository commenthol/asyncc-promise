import { ParallelLimit } from './intern/Parallel'

/** @typedef {import('./types').TaskFunction} TaskFunction */
/** @typedef {import('./types').ParallelOptions} ParallelOptions */

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
 * @name parallelLimit
 * @memberOf module:parallel
 * @static
 * @method
 * @param {Number} limit - number of tasks running in parallel
 * @param {TaskFunction[]} tasks - Array of functions of type `() => Promise`
 * @param {ParallelOptions} [options]
 * @return {Promise} on resolve `.then(results: Array<any> => {})` and
 * on reject `.catch(error: AsynccError => {})` where `error` is the first thrown
 * error containing the properties:
 * - `errors: Array<Error>` list of errors
 * - `errpos: Array<Number>` gives the positions of errors in order as they occur.
 * - `results: Array<Any>` returns the successfull results or undefined
 *
 * @example <caption>without errors - runs 2 tasks in parallel</caption>
 * parallelLimit(2, [
 *   () => Promise.resolve(1),
 *   () => Promise.resolve(3),
 *   () => Promise.resolve(5)
 * ]).then((results) => {
 *   console.log(results)
 *   //> [1, 3, 5]
 * })
 *
 * @example <caption>with errors and timeout = 100ms</caption>
 * parallelLimit(2, [
 *   () => Promise.reject(new Error(1)),
 *   () => Promise.resolve(3),
 *   () => Promise.reject(new Error(5))
 * ], {timeout: 100}).then((result) => { // won't reach here
 * }).catch((err) => {
 *   console.log(err)
 *   //> { AsynccError:
 *   //>   errors: [Error: 1, null, Error: 5],
 *   //>   errpos: [0, 2],
 *   //>   results: [undefined, 3, undefined]
 *   //> }
 * })
 */
export default function parallelLimit (limit, tasks, options = {}) {
  return new Promise((resolve, reject) => {
    new ParallelLimit(limit, tasks, options, resolve, reject)
  })
}
