/** @typedef {import('./types').TimesWithLag} TimesWithLag */
/** @typedef {import('./types').IndexFunction} IndexFunction */
/**
 * Run `task` repeatedly until number `times` is reached.
 *
 * Stops at the first error encountered.
 * An optional `lag` between retries may be used.
 *
 * @name times
 * @memberOf module:serial
 * @static
 * @method
 * @param {Number|TimesWithLag} times runs `times` times. If `times < 0` then "times" cycles endlessly until an error occurs.
 * @param {IndexFunction} task iterator function of type `(index: Number) => Promise`
 * @returns {Promise}
 *
 * @example
 * let arr = []
 * times({times: 4, lag: 100}, // 4 times with 100ms time-lag between retries
 *   (index) => new Promise((resolve) => {
 *     arr.push(index)
 *     resolve(index)
 *   })
 * ).then((res) => {
 *   //> res = 3
 *   //> arr = [0, 1, 2, 3]
 *   assert.equal(res, 3)
 *   assert.deepEqual(arr, [0, 1, 2, 3])
 * })
 */
export default function times(times: number | TimesWithLag, task: IndexFunction): Promise<any>;
export type TimesWithLag = import('./types').TimesWithLag;
export type IndexFunction = import('./types').IndexFunction;
