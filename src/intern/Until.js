/** @typedef {import('../types').IndexFunction} IndexFunction */
/** @typedef {import('../types').IndexTestFunction} IndexTestFunction */
/** @typedef {import('../types').Resolve} Resolve */
/** @typedef {import('../types').Reject} Reject */
/** @typedef {import('../types').TimesWithLag} TimesWithLag */

export class BaseUntil {
  /**
   * @param {IndexTestFunction} test
   * @param {IndexFunction} task
   * @param {object} opts
   * @param {Resolve} resolve
   * @param {Reject} reject
   */
  constructor (test, task, opts = {}, resolve, reject) {
    this.test = test
    this.task = task
    this.opts = opts
    this.resolve = resolve
    this.reject = reject
    this.i = 0
    this.cb = this.cb.bind(this)
    this.run = this.run.bind(this)
    this.init = this.init.bind(this)
  }

  init () {
    const { test, run, i, resolve } = this
    if (!test(i)) {
      run()
    } else {
      resolve()
    }
  }

  /**
   * @param {Error|null} err
   * @param {any} [res]
   */
  cb (err, res) {
    const { resolve, reject, run, test, i } = this
    if (err) {
      err = (typeof err === 'object' ? err : new Error(err))
      reject(err)
    } else if (test(i)) {
      resolve(res)
    } else {
      run()
    }
  }

  run () {
    const { cb, task } = this
    task(this.i++)
      .then((res) => cb(null, res))
      .catch((err) => cb(err))
  }
}

export class Until extends BaseUntil {
  /**
   * @param {IndexTestFunction} test
   * @param {IndexFunction} task
   * @param {object} opts
   * @param {Resolve} resolve
   * @param {Reject} reject
   */
  constructor (test, task, opts, resolve, reject) {
    super(test, task, opts, resolve, reject)
    this.init()
  }
}

export class DoUntil extends Until {
  init () {
    this.run()
  }
}

export class Times extends BaseUntil {
  /**
   * @param {number} times
   * @param {IndexFunction} task
   * @param {TimesWithLag} opts
   * @param {Resolve} resolve
   * @param {Reject} reject
   */
  constructor (times, task, opts, resolve, reject) {
    const test = (i) => (times > 0 && i >= times)
    super(test, task, opts, resolve, reject)
    this.times = times
    this.init()
  }

  init () {
    const { times, run, resolve } = this
    if (times) {
      run()
    } else {
      resolve()
    }
  }

  run () {
    if (!this.i || !this.opts.lag) {
      super.run()
      return
    }
    setTimeout(() => {
      super.run()
    }, this.opts.lag)
  }
}

export class Retry extends Times {
  /**
   * @param {Error|null} err
   * @param {any} [res]
   */
  cb (err, res) {
    const { resolve, reject, run, test, i } = this
    if (!err || test(i)) {
      if (err) {
        err = typeof err === 'object' ? err : new Error(err)
        reject(err)
      } else {
        resolve(res)
      }
    } else {
      run()
    }
  }
}
