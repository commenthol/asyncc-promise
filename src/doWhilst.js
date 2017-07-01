import doUntil from './doUntil'

/**
* Run `task` one or more times until `test` returns `false`.
* Calls next `.catch()` at the first error encountered.
*
* @name doWhilst
* @memberOf module:serial
* @static
* @method
* @param {Function} task - iterator function of type `(index: Number) => Promise`
* @param {Function} test - test function `(index: number) => Boolean`.
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
export default function doWhilst (task, test) {
  return doUntil(task, (n) => !test(n))
}
