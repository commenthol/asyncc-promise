/** @typedef {import('./types').IteratorFunction} IteratorFunction */
/**
* Run `items` on async `task` function in series. Stops at the first error encountered.
*
* @name eachSeries
* @memberOf module:serial
* @static
* @method
* @param {any[]} items Array of items
* @param {IteratorFunction} task iterator function of type `(item: any, index: Number) => Promise`
* @return {Promise<any[]>} on resolve `.then(results: Array<any> => {})` and
* on reject `.catch(error => {})` where `error` is the first thrown
* error containing the properties:
* - `results: Array<Any>` returns the successfull results or undefined
*
* @example <caption>without errors</caption>
* eachSeries([1, 2, 3, 4],
*   (item, index) => (
*     new Promise((resolve, reject) => {
*       resolve(item + index)
*     })
*   ))
*   .then((results) => {
*     console.log(results)
*     //> [1, 3, 5, 7]
*   })
*
* @example <caption>with errors</caption>
* eachSeries([1, 2, 3, 4],
*   (item, index) => (
*     new Promise((resolve, reject) => {
*       if (index !== 2) resolve(item + index)
*       else reject(new Error('error'))
*     })
*   ))
*   .catch((err) => { //
*     console.log(err)
*     //> { Error: error
*     //>   results: [ 1, 3, undefined ]
*     //> }
*   })
*/
export default function eachSeries(items: any[], task: IteratorFunction): Promise<any[]>;
export type IteratorFunction = import('./types').IteratorFunction;
