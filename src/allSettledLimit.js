import { ParallelLimit } from './intern/Parallel'
import { mapAllSettled } from './intern/mapAllSettled'

/**
* Run `tasks` returning Promises in parallel limited to `limit` parallel
* running tasks.
*
* Consider using this function in case of opening a huge amout of parallel IO
* like filehandlers or sockets. Remember those resources are limited!
*
* Does not stop parallel execution on errors. *All tasks get executed.*
* `then()` gets called after the longest running task finishes.
*
* If bail-out on first error is desired, consider set `{bail: true}` as option.
*
* @name allSettledLimit
* @memberOf module:parallel
* @static
* @method
* @param {Number} limit - number of tasks running in parallel
* @param {Array<Function>} tasks - Array of functions of type `() => Promise`
* @param {Object} [options]
* @param {Number} [options.timeout] - timeout in ms which resolves all `tasks` are still running
* @return {Promise} on resolve `.then(results: Array<Object> => {})` where Object equals
*   `{status: 'fullfiled', value: <any>}` or
*   `{status: 'rejected', reason: <Error>}`
*
* @example <caption>without errors - runs 2 tasks in parallel</caption>
* allSettledLimit(2, [
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
* allSettledLimit(2, [
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
export default function allSettledLimit (limit, tasks, options) {
  return new Promise((resolve, reject) => {
    new ParallelLimit(limit, tasks, options, resolve, reject)
  })
    .then(results => mapAllSettled(results))
    .catch(err => mapAllSettled(err, true))
}
