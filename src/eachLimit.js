import { EachLimit } from './intern/Parallel'

/** @typedef {import('./types').IteratorFunction} IteratorFunction */
/** @typedef {import('./types').ParallelOptions} ParallelOptions */

/**
 * Run `items` on async `task` promise in parallel limited to `limit` running in
 * parallel.
 *
 * Does not stop parallel execution on errors. *All tasks get executed.*
 *
 * @name eachLimit
 * @memberOf module:parallel
 * @static
 * @method
 * @param {number} limit - number of tasks running in parallel
 * @param {any[]} items - Array of items
 * @param {IteratorFunction} task - iterator function of type `(item: any, index: Number) => Promise`
 * @param {ParallelOptions} [options]
 * @return {Promise} on resolve `.then(results: Array<any> => {})` and
 * on reject `.catch(error: AsynccError => {})` where `error` is the first thrown
 * error containing the properties:
 * - `errors: Array<Error>` list of errors
 * - `errpos: Array<Number>` gives the positions of errors in order as they occur.
 * - `results: Array<Any>` returns the successfull results or undefined
 *
 * @example <caption>without errors</caption>
 * eachLimit(2, [1, 2, 3, 4],
 *  (item, index) => (
 *    new Promise((resolve, reject) => {
 *      resolve(item + index)
 *    }))
 * )
 * .then((results) => {
 *   console.log(results)
 *   //> [1, 3, 5, 7]
 * })
 * @example <caption>with errors</caption>
 * eachLimit(2, [1, 2, 3, 4],
 *  (item, index) => (
 *    new Promise((resolve, reject) => {
 *      if (index % 2) resolve(item + index)
 *      else reject(new TypeError('error'))
 *  }))
 * )
 * .catch((err) => { //
 *  console.log(err)
 *  //> { TypeError: error
 *  //>   errors: [[Circular], null, TypeError: error, null],
 *  //>   errpos: [0, 2],
 *  //>   results: [undefined, 3, undefined, 7]
 *  //> }
 * })
 */
export default function eachLimit (limit, items, task, options = {}) {
  return new Promise((resolve, reject) => {
    new EachLimit(limit, items, task, options, resolve, reject)
  })
}
