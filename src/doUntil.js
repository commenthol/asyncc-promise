import { DoUntil } from './intern/Until'

/** @typedef {import('./types').IndexFunction} IndexFunction */
/** @typedef {import('./types').IndexTestFunction} IndexTestFunction */

/**
 * Run `task` one or more times until `test` returns `true`.
 * Calls next `.catch()` at the first error encountered.
 *
 * @name doUntil
 * @memberOf module:serial
 * @static
 * @method
 * @param {IndexFunction} task - iterator function of type `(index: Number) => Promise`
 * @param {IndexTestFunction} test - test function `(index: number) => Boolean`.
 * If return value is `true` then promise gets resolved
 * @return {Promise}
 *
 * @example
 * doUntil(
 *   (i) => Promise.resolve(i),
 *   (i) => i > 5
 * ).then((res) => {
 *   console.log(res)
 *   //> 5
 * })
 */
export default function doUntil (task, test) {
  return new Promise((resolve, reject) => {
    new DoUntil(test, task, {}, resolve, reject)
  })
}
