/** @typedef {import('./types').IndexFunction} IndexFunction */
/** @typedef {import('./types').IndexTestFunction} IndexTestFunction */
/**
 * Run `task` repeatedly until `test` returns `true`.
 * Calls next `.catch()` at the first error encountered.
 *
 * @name until
 * @memberOf module:serial
 * @static
 * @method
 * @param {IndexTestFunction} test - test function `(index: number) => Boolean`. If return value is `true` then promise gets resolved
 * @param {IndexFunction} task - iterator function of type `(index: Number) => Promise`
 * @returns {Promise}
 * @example
 * let arr = []
 * until(
 *   (index) => (index >= 4),
 *   (index) => new Promise((resolve) => {
 *     arr.push(index)
 *     resolve(index)
 *   })
 * ).then((res) => {
 *   //> res = 3
 *   //> arr = [0, 1, 2, 3]
 * })
 */
export default function until(test: IndexTestFunction, task: IndexFunction): Promise<any>;
export type IndexFunction = import('./types').IndexFunction;
export type IndexTestFunction = import('./types').IndexTestFunction;
