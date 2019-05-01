import AsynccError from './AsynccError'

export class BaseParallel {
  constructor (limit, length, opts, resolve, reject) {
    limit = Math.abs(limit || length)
    limit = limit < length ? limit : length
    Object.assign(this, {
      opts: opts || {},
      resolve,
      reject,
      error: new AsynccError('err', new Array(length).fill(null), []),
      results: new Array(length).fill(),
      done: 0,
      i: 0,
      l: length,
      length,
      limit
    })
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
  }

  init () {
    while (this.i < this.limit) {
      this.run(this.i++)
    }
  }

  final (errMsg) {
    let { error, results } = this
    if (this.done++) return
    if (error.errpos.length || errMsg) {
      if (errMsg) error.message = errMsg
      this.reject(Object.assign(error, { results }))
    } else {
      this.resolve(results)
    }
  }

  cb (j, err, res) {
    let { error, results, opts } = this
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

  run () {} // needs implementation
}

export class EachLimit extends BaseParallel {
  constructor (limit, items, task, opts, resolve, reject) {
    super(limit, items.length, opts, resolve, reject)
    Object.assign(this, { items, task })
    this.init()
  }

  run (j) {
    this.task(this.items[j], j)
      .then((res) => this.cb(j, null, res))
      .catch((err) => this.cb(j, err))
  }
}

export class ParallelLimit extends BaseParallel {
  constructor (limit, tasks, opts, resolve, reject) {
    super(limit, tasks.length, opts, resolve, reject)
    Object.assign(this, { tasks })
    this.init()
  }

  run (j) {
    this.tasks[j]()
      .then((res) => this.cb(j, null, res))
      .catch((err) => this.cb(j, err))
  }
}
