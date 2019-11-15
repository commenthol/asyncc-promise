import allSettledLimit from './allSettledLimit'

/**
* Run `tasks` returning Promises in parallel
*
* Does not stop parallel execution on errors. *All tasks get executed.*
* `then()` gets called after the longest running task finishes.
*
* If bail-out on first error is desired, consider set `{bail: true}` as option.
*
* @name allSettled
* @memberOf module:parallel
* @static
* @method
* @param {Array<Function>} tasks - Array of functions of type `() => Promise`
* @param {Object} [options]
* @param {Number} [options.timeout] - timeout in ms which resolves all `tasks` are still running
* @return {Promise} on resolve `.then(results: Array<Object> => {})` where Object equals
*   `{status: 'fullfiled', value: <any>}` or
*   `{status: 'rejected', reason: <Error>}`
*
* @example <caption>without errors</caption>
* allSettled([
*   () => Promise.resolve(1), // NOTE to wrap the Promise into a function
*   () => Promise.resolve(3),
*   () => Promise.resolve(5)
* ]).then((results) => {
*   console.log(results)
*   //> [{status: 'fullfilled', value: 1},
*   //>  {status: 'fullfilled', value: 3},
*   //>  {status: 'fullfileld', value: 5}]
* })
*
* @example <caption>with errors and timeout = 100ms</caption>
* allSettled([
*   () => Promise.reject(new Error(1)),
*   () => Promise.resolve(3),
*   () => Promise.reject(new Error(5))
* ], {timeout: 100}).then((result) => {
*   console.log(results)
*   //> [{status: 'rejected', value: Error(1)},
*   //>  {status: 'fullfilled', value: 3},
*   //>  {status: 'rejected', reason: Error(5)}]
* })
*/
export default function allSettled (tasks, options) {
  return allSettledLimit(0, tasks, options)
}
