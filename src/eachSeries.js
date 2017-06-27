/**
* Run `items` on async `task` function in series. Stops at the first error encountered.
*
* @name eachSeries
* @memberOf module:serial
* @static
* @method
* @param {Array<any>} items - Array of items
* @param {Function} task - iterator function of type `function (item: any, cb: Function, index: Number)`
* @return {Promise}
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
* @example <caption>with errors</caption>
* eachSeries([1, 2, 3, 4],
*   (item, index) => (
*     new Promise((resolve, reject) => {
*       if (index !== 2) resolve(item + index)
*       else reject(new TypeError('error'))
*     })
*   ))
*   .catch((err) => { //
*     console.log(err)
*     //> { TypeError: error
*     //>   results: [ 1, 3, undefined ]
*     //> }
*   })
*/
export default function eachSeries (items, task) {
  return new Promise((resolve, reject) => {
    let length = items.length
    let results = []
    let i = 0

    function cb (err, res) {
      results.push(res)
      /* istanbul ignore else  */
      if (err) {
        reject(Object.assign(err, {results}))
      } else if (length === i) {
        resolve(results)
      } else if (i < length) {
        run()
      }
    }

    function run () {
      let item = items[i]
      task(item, i++)
        .then((res) => cb(null, res))
        .catch((err) => cb(err))
    }

    run()
  })
}
