import { Series } from './intern/Series'

/**
 * Run `tasks` functions which return a promise in series
 * The function breaks after the first error encountered
 *
 * Can process huge number of tasks.
 *
 * @name series
 * @memberOf module:serial
 * @static
 * @method
 * @param {Array} tasks - Array of functions which return a Promise
 * @return {Promise} on resolve `.then(results: Array<any> => {})` and
 * on reject `.catch(error => {})` where `error` is the first thrown
 * error containing the properties:
 * - `results: Array<Any>` returns the successfull results or undefined
 *
 * @example <caption>without errors</caption>
 * series([
 *   () => Promise.resolve(1),
 *   () => Promise.resolve(2),
 *   () => Promise.resolve(3)
 * ]).then((results) => {
 *   console.log(results)
 *   //> [1, 2, 3]
 * })
 *
 * @example <caption>with errors</caption>
 * series([
 *   () => Promise.resolve(1),
 *   () => Promise.resolve(2),
 *   () => Promise.reject(new Error(3)), // breaks on first error
 *   () => Promise.resolve(4)
 * ]).catch((err) => { //
 *   console.log(err)
 *   //> { Error: 3
 *   //>   results: [ 1, 2, undefined ]
 *   //> }
 * })
 */
export default function series (tasks) {
  return new Promise((resolve, reject) => {
    new Series(tasks, resolve, reject)
  })
}
