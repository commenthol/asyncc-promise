/**
* promisify async callback functions `(arg1, arg2, cb) => {}` become
* `(arg1, arg2) => Promise`
*
* @method promisify
* @static
*
* @param {Function} fn - async function using callbacks
* @return {Function} returning `Promise`
*
* @example
* const fn = (timeout, payload, cb) =>
*   setTimeout(() => cb(null, payload), timeout)
* const promise = promisify(fn)
* promise(10, 'a').then((res) => {
*   //> res = 'a'
* })
*/
export const promisify = (fn) =>
  (...args) => (
    new Promise((resolve, reject) => {
      fn(...args, (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    })
  )
