
export class BaseSeries {
  constructor (length, resolve, reject) {
    Object.assign(this, {
      length,
      resolve,
      reject,
      results: [],
      i: 0
    })
    this.cb = this.cb.bind(this)
    this.run = this.run.bind(this)
  }

  cb (err, res) {
    const {results, length, i} = this
    results.push(res)
    if (err) {
      err = typeof err === 'object' ? err : new Error(err)
      this.reject(Object.assign(err, {results}))
    } else if (length === i) {
      this.resolve(results)
    } else if (i < length) {
      this.run()
    }
  }

  run () {}
}

export class EachSeries extends BaseSeries {
  constructor (items, task, resolve, reject) {
    super(items.length, resolve, reject)
    Object.assign(this, {items, task})
    this.run()
  }

  run () {
    const {items, task, cb} = this
    task(items[this.i], this.i++)
      .then((res) => cb(null, res))
      .catch((err) => cb(err))
  }
}

export class Series extends BaseSeries {
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
    const {length, i} = this
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
