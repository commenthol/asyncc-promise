import AsynccError from './AsynccError'

/** @typedef {import('../types').IteratorFunction} IteratorFunction */
/** @typedef {import('../types').TaskFunction} TaskFunction */
/** @typedef {import('../types').ParallelOptions} ParallelOptions */
/** @typedef {import('../types').Resolve} Resolve */
/** @typedef {import('../types').Reject} Reject */

export class BaseParallel {
  /**
   * @internal
   * @param {number} limit
   * @param {number} length
   * @param {ParallelOptions} opts
   * @param {Resolve} resolve
   * @param {Reject} reject
   */
  constructor (limit, length, opts, resolve, reject) {
    limit = Math.abs(limit || length)
    limit = limit < length ? limit : length

    this.opts = opts || {}
    this.resolve = resolve
    this.reject = reject
    this.error = new AsynccError('err', new Array(length).fill(null), [])
    this.results = new Array(length).fill(undefined)
    this.done = 0
    this.i = 0
    this.l = length
    this.length = length
    this.limit = limit

    if (this.opts.timeout) {
      setTimeout(() => {
        if (this.l) { // tasks are still processed
          this.final('err_timeout')
        }
      }, this.opts.timeout)
    }
    this.run = this.run.bind(this)
    this.cb = this.cb.bind(this)
    this.final = this.final.bind(this)
    if (limit <= 0) this.final()
  }

  init () {
    while (this.i < this.limit) {
      this.run(this.i++)
    }
  }

  final (errMsg) {
    const { error, results } = this
    if (this.done++) return
    if (error.errpos.length || errMsg) {
      if (errMsg) error.message = errMsg
      this.reject(Object.assign(error, { results }))
    } else {
      this.resolve(results)
    }
  }

  cb (j, err, res) {
    const { error, results, opts } = this
    results[j] = res
    error.errors[j] = err || null
    if (err) {
      error.errpos.push(j)
      if (opts.bail) {
        this.final('err_bail')
        return
      }
    }
    this.l--
    if (this.i < this.length) {
      this.run(this.i++)
    } else if (!this.l) {
      this.final()
    }
  }

  /**
   * @param {number} i
   */
  run (i) {} // needs implementation
}

export class EachLimit extends BaseParallel {
  /**
   * @internal
   * @param {number} limit
   * @param {any[]} items
   * @param {IteratorFunction} task
   * @param {ParallelOptions} opts
   * @param {Resolve} resolve
   * @param {Reject} reject
   */
  constructor (limit, items, task, opts, resolve, reject) {
    super(limit, items.length, opts, resolve, reject)
    this.items = items
    this.task = task
    this.init()
  }

  /**
   * @param {number} j
   */
  run (j) {
    this.task(this.items[j], j)
      .then((res) => this.cb(j, null, res))
      .catch((err) => this.cb(j, err))
  }
}

export class ParallelLimit extends BaseParallel {
  /**
   * @internal
   * @param {number} limit
   * @param {TaskFunction[]} tasks
   * @param {ParallelOptions} opts
   * @param {Resolve} resolve
   * @param {Reject} reject
   */
  constructor (limit, tasks, opts, resolve, reject) {
    super(limit, tasks.length, opts, resolve, reject)
    this.tasks = tasks
    this.init()
  }

  /**
   * @param {number} j
   */
  run (j) {
    this.tasks[j]()
      .then((res) => this.cb(j, null, res))
      .catch((err) => this.cb(j, err))
  }
}
