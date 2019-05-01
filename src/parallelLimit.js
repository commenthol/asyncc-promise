import { ParallelLimit } from './intern/Parallel'

/**
* Run `tasks` returning Promises in parallel limited to `limit` parallel
* running tasks.
*
* Does not stop parallel execution on errors. *All tasks get executed.*
* `then()` gets called after the longest running task finishes.
*
* If bail-out on first error is desired, consider set `{bail: true}` as option.
*
* @name parallelLimit
* @memberOf module:parallel
* @static
* @method
* @param {Number} limit - number of tasks running in parallel
* @param {Array<Function>} tasks - Array of functions of type `() => Promise`
* @param {Object} [options]
* @param {Number} [options.timeout] - timeout in ms which throwing `AsynccError` in case that `tasks` are still running
* @param {Boolean} [options.bail] - bail-out on first error
* @return {Promise} on resolve `.then(results: Array<any> => {})` and
* on reject `.catch(error: AsynccError => {})` where `error` is the first thrown
* error containing the properties:
* - `errors: Array<Error>` list of errors
* - `errpos: Array<Number>` gives the positions of errors in order as they occur.
* - `results: Array<Any>` returns the successfull results or undefined
*
* @example
* // runs 2 tasks in parallel
* parallelLimit(2, [
*   (cb) => { cb(null, 1) },
*   (cb) => { cb('error', 2) },
*   (cb) => { cb(null, 3) }
* ], (err, res, errorpos) => {
*   //> err = [ ,'error', ]
*   //> res = [1, 2, 3]
*   //> errorpos = [1]
* })
*/
export default function parallelLimit (limit, tasks, opts) {
  return new Promise((resolve, reject) => {
    new ParallelLimit(limit, tasks, opts, resolve, reject)
  })
}
