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
* const fn = (t, a, cb) => setTimeout(() => cb(a), t)
* const p = promisify(fn)
* p(10, 'a').then((res) => {
*   //> res = 'a'
* })
*/
export const promisify = (fn) =>
  (...args) => (
    new Promise((resolve, reject) => {
      fn(...args, (err, ...res) => {
        if (err) reject(err)
        else resolve(...res)
      })
    })
  )
