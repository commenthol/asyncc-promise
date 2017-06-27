/**
* Run `items` on async `task` promise in parallel limited to `limit` parallel.
*
* Does not stop parallel execution on errors. *All tasks get executed.*
*
* @name eachLimit
* @memberOf module:parallel
* @static
* @method
* @param {Number} limit - number of tasks running in parallel
* @param {Array} items - Array of items `any[]`
* @param {Function} task - iterator function of type `function (item: any, index: Number)` returning a Promise
* @return {Promise} on resolve `.then(results => {})` where `results: Array<any>` and
* on reject `.catch(error => {})` where `error` is the first thrown error containing the
* properties
* - `errors: Array<Error>` list of errors
* - `errpos: Array<Number>` gives the positions of errors in order as they occur.
* - `results: Array<Any>` returns the successfull results or undefined
* @example <caption>without errors</caption>
* eachLimit(2, [1, 2, 3, 4],
*  (item, index) => (
*    new Promise((resolve, reject) => {
*      resolve(item + index)
*    }))
* )
* .then((results) => {
*   console.log(results)
*   //> [1, 3, 5, 7]
* })
* @example <caption>with errors</caption>
* eachLimit(2, [1, 2, 3, 4],
*  (item, index) => (
*    new Promise((resolve, reject) => {
*      if (index % 2) resolve(item + index)
*      else reject(new TypeError('error'))
*  }))
* )
* .catch((err) => { //
*  console.log(err)
*  //> { TypeError: error
*  //>   errors: [[Circular], null, TypeError: error, null],
*  //>   errpos: [0, 2],
*  //>   results: [undefined, 3, undefined, 7]
*  //> }
* })
*/
export default function eachLimit (limit, items, task) {
  return new Promise((resolve, reject) => {
    let length = items.length
    limit = Math.abs(limit || length)
    let errpos = []
    let errors = new Array(length)
    let results = new Array(length)
    let i = 0
    let l = length

    function cb (j, err, res) {
      results[j] = res
      errors[j] = err
      if (err) errpos.push(j)
      l--
      if (i < length) {
        run(i++)
      } else if (!l) {
        if (!errpos.length) {
          resolve(results)
        } else {
          const err = errors[0] instanceof Error ? errors[0] : new Error('')
          Object.assign(err, {errors, errpos, results})
          reject(err)
        }
      }
    }

    function run (j) {
      let item = items[j]
      task(item, j)
        .then((res) => cb(j, null, res))
        .catch((err) => cb(j, err))
    }

    (function () {
      limit = limit < length ? limit : length
      while (i < limit) {
        run(i++)
      }
    })()
  })
}
