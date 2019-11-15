import { Retry } from './intern/Until'

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
 * @param {Number|Object} times - retry max. `times` times - default=2
 * @param {Number} [times.times=2] - max. number of retries
 * @param {Number} [times.lag=0] - time-lag in ms between retries
 * @param {Function} task - iterator function of type `(index: Number) => Promise`
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
export default function retry (times, task) {
  let opts = {}
  if (typeof times === 'object') {
    opts = times
    times = times.times
  }
  return new Promise((resolve, reject) => {
    new Retry(times || 2, task, opts, resolve, reject)
  })
}
