import { Times } from './intern/Until'

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
export default function times (times, task) {
  let opts = {}
  let _times
  if (typeof times === 'object') {
    opts = times
    _times = times.times || 0
  } else {
    _times = times || 0
  }
  return new Promise((resolve, reject) => {
    new Times(_times, task, opts, resolve, reject)
  })
}
