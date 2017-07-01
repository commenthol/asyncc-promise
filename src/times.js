import {Times} from './intern/Until'

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
* @param {Number|Object} times - runs `times` times. If `times < 0` then "times" cycles endlessly until an error occurs.
* @param {Number} [times.times=0] - max. number of retries
* @param {Number} [times.lag=0] - time-lag in ms between retries
* @param {Function} task - iterator function of type `(index: Number) => Promise`
* @returns {Promise}
*
* @example
* var arr = []
* return times(4,
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
  if (typeof times === 'object') {
    opts = times
    times = times.times
  }
  return new Promise((resolve, reject) => {
    new Times(times, task, opts, resolve, reject)
  })
}
