/** @typedef {import('./types').IndexFunction} IndexFunction */
/** @typedef {import('./types').IndexTestFunction} IndexTestFunction */
/**
 * Run `task` one or more times until `test` returns `false`.
 * Calls next `.catch()` at the first error encountered.
 *
 * @name doWhilst
 * @memberOf module:serial
 * @static
 * @method
 * @param {IndexFunction} task - iterator function of type `(index: Number) => Promise`
 * @param {IndexTestFunction} test - test function `(index: number) => boolean`.
 * If return value is `false` then promise gets resolved
 * @return {Promise}
 *
 * @example
 * doWhilst(
 *   (i) => Promise.resolve(i),
 *   (i) => i <= 5
 * ).then((res) => {
 *   console.log(res)
 *   //> 5
 * })
 */
export default function doWhilst(task: IndexFunction, test: IndexTestFunction): Promise<any>;
export type IndexFunction = import('./types').IndexFunction;
export type IndexTestFunction = import('./types').IndexTestFunction;
