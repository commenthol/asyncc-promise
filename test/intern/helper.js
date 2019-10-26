/**
 * execute async tasks after a timeout
 */
export class Timeout {
  constructor () {
    this.order = []
    this.task = this.task.bind(this)
    this.taskArg = this.taskArg.bind(this)
    this.trapError = this.trapError.bind(this)
  }

  /**
   * execute task in `time` ms and collect the order of processing this task
   * @param {number} time - in ms
   * @param {Error} [err] - pass optional error
   * @param {any} [res] - pass result
   * @return {Promise}
   */
  task (time, err, res) {
    return () => (
      new Promise((resolve, reject) => {
        setTimeout(() => {
          res = res || time
          this.order.push(res)
          if (err) reject(err)
          else resolve(res)
        }, time)
      })
    )
  }

  /**
   * @param {number} time - in ms
   * @param {Error} [err] - pass optional error
   * @param {any} [res] - pass result
   * @return {Function} `function(res: Array, cb: Function)`
   */
  taskArg (time, err, val) {
    return (res, cb) => {
      setTimeout(() => {
        res.push(val || time)
        this.order.push(time)
        cb(err, res)
      }, time)
    }
  }

  /**
   * trap error with function of arity 3
   * @return {Function} `function(err: <Error>, res: any, cb: function)`
   */
  trapError () {
    return (err, res, cb) => {
      this.order.push(err)
      cb(null, res)
    }
  }
}
