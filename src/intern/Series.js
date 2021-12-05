
/** @typedef {import('../types').IteratorFunction} IteratorFunction */
/** @typedef {import('../types').TaskFunction} TaskFunction */
/** @typedef {import('../types').Resolve} Resolve */
/** @typedef {import('../types').Reject} Reject */

export class BaseSeries {
  /**
   * @param {number} length
   * @param {Resolve} resolve
   * @param {Reject} reject
   */
  constructor (length, resolve, reject) {
    this.length = length
    this.resolve = resolve
    this.reject = reject
    this.results = []
    this.i = 0
    this.cb = this.cb.bind(this)
    this.run = this.run.bind(this)
  }

  /**
   * @param {Error|null} err
   * @param {any} [res]
   */
  cb (err, res) {
    const { results, length, i } = this
    results.push(res)
    if (err) {
      err = typeof err === 'object' ? err : new Error(err)
      this.reject(Object.assign(err, { results }))
    } else if (length === i) {
      this.resolve(results)
    } else if (i < length) {
      this.run()
    }
  }

  run () {}
}

export class EachSeries extends BaseSeries {
  /**
   * @param {any[]} items
   * @param {IteratorFunction} task
   * @param {Resolve} resolve
   * @param {Reject} reject
   */
  constructor (items, task, resolve, reject) {
    super(items.length, resolve, reject)
    this.items = items
    this.task = task
    this.run()
  }

  run () {
    const { items, task, cb } = this
    task(items[this.i], this.i++)
      .then((res) => cb(null, res))
      .catch((err) => cb(err))
  }
}

export class Series extends BaseSeries {
  /**
   * @param {TaskFunction[]} tasks
   * @param {Resolve} resolve
   * @param {Reject} reject
   */
  constructor (tasks, resolve, reject) {
    super(tasks.length, resolve, reject)
    this.tasks = tasks
    this.run()
  }

  run (arg) {
    this.tasks[this.i++](arg)
      .then((res) => this.cb(null, res))
      .catch((err) => this.cb(err))
  }
}

export class Compose extends Series {
  cb (err, res) {
    const { length, i } = this
    if (err) {
      err = typeof err === 'object' ? err : new Error(err)
      this.reject(err)
    } else if (length === i) {
      this.resolve(res)
    } else if (i < length) {
      this.run(res)
    }
  }
}
