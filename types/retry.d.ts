/** @typedef {import('./types').TimesWithLag} TimesWithLag */
/** @typedef {import('./types').IndexFunction} IndexFunction */
/**
 * Run `task` max. `times` times. Stops at first iteration where no error is returned.
 *
 * Calls next `.then()` if `times` is reached or `task` returned no error,
 * otherwise next `.catch()`.
 *
 * @name retry
 * @memberOf module:serial
 * @static
 * @method
 * @param {TimesWithLag|number} times - retry max. `times` times - default=2
 * @param {IndexFunction} task - iterator function of type `(index: Number) => Promise`
 * @returns {Promise}
 * @example
 * retry({times: 3, lag: 100}, // max. 3 retries with 100ms time-lag between retries
 *   (index) => new Promise((resolve, reject) => {
 *     let err = index < 2 ? new Error() : null
 *     if (err) reject(err)
 *     else resolve(index)
 *   })
 * ).then((res) => {
 *   //> res = 2
 * })
 */
export default function retry(times: TimesWithLag | number, task: IndexFunction): Promise<any>;
export type TimesWithLag = import('./types').TimesWithLag;
export type IndexFunction = import('./types').IndexFunction;
