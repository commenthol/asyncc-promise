import until from './until'

/** @typedef {import('./types').IndexFunction} IndexFunction */
/** @typedef {import('./types').IndexTestFunction} IndexTestFunction */

/**
 * Run `task` repeatedly until `test` returns `false`.
 * Calls next `.catch()` at the first error encountered.
 *
 * @name whilst
 * @memberOf module:serial
 * @static
 * @method
 * @param {IndexTestFunction} test - test function `(index: number) => Boolean`. If return value is `false` then promise gets resolved
 * @param {IndexFunction} task - iterator function of type `(index: Number) => Promise`
 * @returns {Promise}
 * @example
 * let arr = []
 * whilst(
 *   (index) => (index < 4),
 *   (index) => new Promise((resolve) => {
 *     arr.push(index)
 *     resolve(index)
 *   })
 * ).then((res) => {
 *   //> res = 3
 *   //> arr = [0, 1, 2, 3]
 * })
 */
export default function whilst (test, task) {
  return until((n) => (!test(n)), task)
}
