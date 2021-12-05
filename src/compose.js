import { Compose } from './intern/Series'

/**
 * Run composed `tasks` promises in series.
 *
 * Result from a task is passed on to the next task.
 * Stops on errors and immediatelly calls next `.catch()` in this case.
 *
 * @name compose
 * @memberOf module:serial
 * @static
 * @method
 * @param {...Function|Array} tasks - Arguments or Array of functions of type
 * `(arg: any) => Promise` where
 * - `arg` - an argument which is passed from one task to the other
 * @return {Function} composed function of `(arg: any) => Promise` where
 * `arg` - initial argument which is passed from one task to the other.
 *
 * @example
 * var c = compose(
 *  (res) => Promise.resolve(res + 1),
 *  (res) => Promise.resolve(res + 1),
 *  (res) => Promise.resolve(res + 1)
 * )
 * c(2).then((res) => {
 *  //> res = 5
 * })
 */
export default function compose (...tasks) {
  return (arg) => {
    return new Promise((resolve, reject) => {
      new Compose(flatten([() => Promise.resolve(arg)].concat(tasks)), resolve, reject)
    })
  }
}

function flatten (arr) {
  return arr.reduce((a, b) => a.concat(
    Array.isArray(b)
      ? flatten(b)
      : b
  ), [])
}
