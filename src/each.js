import eachLimit from './eachLimit'

/**
* Run `items` on async `task` promise in parallel.
*
* Does not stop parallel execution on errors. *All tasks get executed.*
*
* @name each
* @memberOf module:parallel
* @static
* @method
* @param {Array<any>} items - Array of items
* @param {Function} task - iterator function of type `(item: any, index: Number) => Promise`
* @param {Object} [options]
* @param {Number} [options.timeout] - timeout in ms which throws `AsynccError` in case that `tasks` are still running
* @param {Boolean} [options.bail] - bail-out on first error
* @return {Promise} on resolve `.then(results: Array<any> => {})` and
* on reject `.catch(error: AsynccError => {})` where `error` is the first thrown
* error containing the properties:
* - `errors: Array<Error>` list of errors
* - `errpos: Array<Number>` gives the positions of errors in order as they occur.
* - `results: Array<Any>` returns the successfull results or undefined
*
* @example <caption>without errors</caption>
* each([1, 2, 3],
*   (item, index) => (
*     new Promise((resolve, reject) => {
*       resolve(item + index)
*   }))
* )
* .then((results) => {
*   console.log(results)
*   //> [1, 3, 5]
* })
*
* @example <caption>with errors</caption>
* each([1, 2, 3],
*   (item, index) => (
*     new Promise((resolve, reject) => {
*       if (index % 2) resolve(item + index)
*       else reject(new Error('error'))
*   }))
* )
* .catch((err) => { //
*   console.log(err)
*   //> { AsynccError: err
*   //>   errors: [
*   //>     Error: error,
*   //>     null,
*   //>     Error: error
*   //>   ],
*   //>   errpos: [0, 2],
*   //>   results: [undefined, 3, undefined]
*   //> }
* })
*/
export default function each (items, task, options) {
  return eachLimit(0, items, task, options)
}
