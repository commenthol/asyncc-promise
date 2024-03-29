import parallelLimit from './parallelLimit'

/** @typedef {import('./types').TaskFunction} TaskFunction */
/** @typedef {import('./types').ParallelOptions} ParallelOptions */

/**
 * Run `tasks` returning Promises in parallel.
 *
 * Does not stop parallel execution on errors. *All tasks get executed.*
 * `then()` gets called after the longest running task finishes.
 *
 * Consider `Promise.allSettled()` as replacement for this function.
 *
 * If bail-out on first error is desired, consider `Promise.all()`
 * as an alternative, or set `{bail: true}` as option.
 *
 * @name parallel
 * @memberOf module:parallel
 * @static
 * @method
 * @param {TaskFunction[]} tasks - Array of functions of type `() => Promise`
 * @param {ParallelOptions} [options]
 * @return {Promise} on resolve `.then(results: Array<any> => {})` and
 * on reject `.catch(error: AsynccError => {})` where `error` is the first thrown
 * error containing the properties:
 * - `errors: Array<Error>` list of errors
 * - `errpos: Array<Number>` gives the positions of errors in order as they occur.
 * - `results: Array<Any>` returns the successfull results or undefined
 *
 * @example <caption>without errors</caption>
 * parallel([
 *   () => Promise.resolve(1),
 *   () => Promise.resolve(3),
 *   () => Promise.resolve(5)
 * ]).then((results) => {
 *   console.log(results)
 *   //> [1, 3, 5]
 * })
 *
 * @example <caption>with errors and timeout = 100ms</caption>
 * parallel([
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
export default function parallel (tasks, options) {
  return parallelLimit(0, tasks, options)
}
