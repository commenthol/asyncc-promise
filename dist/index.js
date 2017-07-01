(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.asyncc = global.asyncc || {})));
}(this, (function (exports) { 'use strict';

var AsynccError = (function (Error) {
  function AsynccError (message, errors, errpos, results) {
    Error.call(this, message);
    this.name = 'AsynccError';
    this.errors = errors;
    this.errpos = errpos;
    if (results) { this.results = results; }
  }

  if ( Error ) AsynccError.__proto__ = Error;
  AsynccError.prototype = Object.create( Error && Error.prototype );
  AsynccError.prototype.constructor = AsynccError;

  return AsynccError;
}(Error));

var BaseSeries = function BaseSeries (length, resolve, reject) {
  Object.assign(this, {
    length: length,
    resolve: resolve,
    reject: reject,
    results: [],
    i: 0
  });
  this.cb = this.cb.bind(this);
  this.run = this.run.bind(this);
};

BaseSeries.prototype.cb = function cb (err, res) {
  var ref = this;
    var results = ref.results;
    var length = ref.length;
    var i = ref.i;
  results.push(res);
  /* istanbul ignore else*/
  if (err) {
    err = typeof err === 'object' ? err : new Error(err);
    this.reject(Object.assign(err, {results: results}));
  } else if (length === i) {
    this.resolve(results);
  } else if (i < length) {
    this.run();
  }
};

BaseSeries.prototype.run = function run () {};

var EachSeries = (function (BaseSeries) {
  function EachSeries (items, task, resolve, reject) {
    BaseSeries.call(this, items.length, resolve, reject);
    Object.assign(this, {items: items, task: task});
    this.run();
  }

  if ( BaseSeries ) EachSeries.__proto__ = BaseSeries;
  EachSeries.prototype = Object.create( BaseSeries && BaseSeries.prototype );
  EachSeries.prototype.constructor = EachSeries;

  EachSeries.prototype.run = function run () {
    var ref = this;
    var items = ref.items;
    var task = ref.task;
    var cb = ref.cb;
    task(items[this.i], this.i++)
      .then(function (res) { return cb(null, res); })
      .catch(function (err) { return cb(err); });
  };

  return EachSeries;
}(BaseSeries));

var Series = (function (BaseSeries) {
  function Series (tasks, resolve, reject) {
    BaseSeries.call(this, tasks.length, resolve, reject);
    this.tasks = tasks;
    this.run();
  }

  if ( BaseSeries ) Series.__proto__ = BaseSeries;
  Series.prototype = Object.create( BaseSeries && BaseSeries.prototype );
  Series.prototype.constructor = Series;

  Series.prototype.run = function run (arg) {
    var this$1 = this;

    this.tasks[this.i++](arg)
      .then(function (res) { return this$1.cb(null, res); })
      .catch(function (err) { return this$1.cb(err); });
  };

  return Series;
}(BaseSeries));

var Compose = (function (Series) {
  function Compose () {
    Series.apply(this, arguments);
  }

  if ( Series ) Compose.__proto__ = Series;
  Compose.prototype = Object.create( Series && Series.prototype );
  Compose.prototype.constructor = Compose;

  Compose.prototype.cb = function cb (err, res) {
    var ref = this;
    var length = ref.length;
    var i = ref.i;
    /* istanbul ignore else  */
    if (err) {
      err = typeof err === 'object' ? err : new Error(err);
      this.reject(err);
    } else if (length === i) {
      this.resolve(res);
    } else if (i < length) {
      this.run(res);
    }
  };

  return Compose;
}(Series));

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
function compose () {
  var tasks = [], len = arguments.length;
  while ( len-- ) tasks[ len ] = arguments[ len ];

  return function (arg) {
    return new Promise(function (resolve, reject) {
      new Compose(flatten([function () { return Promise.resolve(arg); }].concat(tasks)), resolve, reject);
    })
  }
}

function flatten (arr) {
  return arr.reduce(function (a, b) { return a.concat(
    Array.isArray(b)
      ? flatten(b)
      : b
  ); }, [])
}

var BaseUntil = function BaseUntil (test, task, opts, resolve, reject) {
  if ( opts === void 0 ) opts = {};

  Object.assign(this, {
    test: test,
    task: task,
    opts: opts,
    resolve: resolve,
    reject: reject,
    i: 0,
    cb: this.cb.bind(this),
    run: this.run.bind(this),
    init: this.init.bind(this)
  });
};

BaseUntil.prototype.init = function init () {
  var ref = this;
    var test = ref.test;
    var run = ref.run;
    var i = ref.i;
    var resolve = ref.resolve;
  if (!test(i)) {
    run();
  } else {
    resolve();
  }
};

BaseUntil.prototype.cb = function cb (err, res) {
  var ref = this;
    var resolve = ref.resolve;
    var reject = ref.reject;
    var run = ref.run;
    var test = ref.test;
    var i = ref.i;
  if (err) {
    err = typeof err === 'object' ? err : new Error(err);
    reject(err);
  } else if (test(i)) {
    resolve(res);
  } else {
    run();
  }
};

BaseUntil.prototype.run = function run () {
  var ref = this;
    var cb = ref.cb;
    var task = ref.task;
  task(this.i++)
    .then(function (res) { return cb(null, res); })
    .catch(function (err) { return cb(err); });
};

var Until = (function (BaseUntil) {
  function Until (test, task, opts, resolve, reject) {
    BaseUntil.call(this, test, task, opts, resolve, reject);
    this.init();
  }

  if ( BaseUntil ) Until.__proto__ = BaseUntil;
  Until.prototype = Object.create( BaseUntil && BaseUntil.prototype );
  Until.prototype.constructor = Until;

  return Until;
}(BaseUntil));

var DoUntil = (function (Until) {
  function DoUntil () {
    Until.apply(this, arguments);
  }

  if ( Until ) DoUntil.__proto__ = Until;
  DoUntil.prototype = Object.create( Until && Until.prototype );
  DoUntil.prototype.constructor = DoUntil;

  DoUntil.prototype.init = function init () {
    this.run();
  };

  return DoUntil;
}(Until));

var Times = (function (BaseUntil) {
  function Times (times, task, opts, resolve, reject) {
    var test = function (i) { return (times > 0 && i >= times); };
    BaseUntil.call(this, test, task, opts, resolve, reject);
    this.times = times;
    this.init();
  }

  if ( BaseUntil ) Times.__proto__ = BaseUntil;
  Times.prototype = Object.create( BaseUntil && BaseUntil.prototype );
  Times.prototype.constructor = Times;

  Times.prototype.init = function init () {
    var ref = this;
    var times = ref.times;
    var run = ref.run;
    var resolve = ref.resolve;
    if (times) {
      run();
    } else {
      resolve();
    }
  };

  Times.prototype.run = function run () {
    var this$1 = this;

    if (!this.i || !this.opts.lag) {
      BaseUntil.prototype.run.call(this);
      return
    }
    setTimeout(function () {
      BaseUntil.prototype.run.call(this$1);
    }, this.opts.lag);
  };

  return Times;
}(BaseUntil));

var Retry = (function (Times) {
  function Retry () {
    Times.apply(this, arguments);
  }

  if ( Times ) Retry.__proto__ = Times;
  Retry.prototype = Object.create( Times && Times.prototype );
  Retry.prototype.constructor = Retry;

  Retry.prototype.cb = function cb (err, res) {
    var ref = this;
    var resolve = ref.resolve;
    var reject = ref.reject;
    var run = ref.run;
    var test = ref.test;
    var i = ref.i;
    if (!err || test(i)) {
      if (err) {
        err = typeof err === 'object' ? err : new Error(err);
        reject(err);
      } else {
        resolve(res);
      }
    } else {
      run();
    }
  };

  return Retry;
}(Times));

/**
* Run `task` one or more times until `test` returns `true`.
* Calls next `.catch()` at the first error encountered.
*
* @name doUntil
* @memberOf module:serial
* @static
* @method
* @param {Function} task - iterator function of type `(index: Number) => Promise`
* @param {Function} test - test function `(index: number) => Boolean`.
* If return value is `true` then promise gets resolved
* @return {Promise}
*
* @example
* doUntil(
*   (i) => Promise.resolve(i),
*   (i) => i > 5
* ).then((res) => {
*   console.log(res)
*   //> 5
* })
*/
function doUntil (task, test) {
  return new Promise(function (resolve, reject) {
    new DoUntil(test, task, {}, resolve, reject);
  })
}

/**
* Run `task` one or more times until `test` returns `false`.
* Calls next `.catch()` at the first error encountered.
*
* @name doWhilst
* @memberOf module:serial
* @static
* @method
* @param {Function} task - iterator function of type `(index: Number) => Promise`
* @param {Function} test - test function `(index: number) => Boolean`.
* If return value is `false` then promise gets resolved
* @return {Promise}
*
* @example
* doWhilst(
*   (i) => Promise.resolve(i),
*   (i) => i <= 5
* ).then((res) => {
*   console.log(res)
*   //> 5
* })
*/
function doWhilst (task, test) {
  return doUntil(task, function (n) { return !test(n); })
}

var BaseParallel = function BaseParallel (limit, length, opts, resolve, reject) {
  var this$1 = this;

  limit = Math.abs(limit || length);
  limit = limit < length ? limit : length;
  Object.assign(this, {
    opts: opts || {},
    resolve: resolve,
    reject: reject,
    error: new AsynccError('err', new Array(length).fill(), []),
    results: new Array(length).fill(),
    done: 0,
    i: 0,
    l: length,
    length: length,
    limit: limit
  });
  if (this.opts.timeout) {
    setTimeout(function () {
      if (this$1.l) { // tasks are still processed
        this$1.final('err_timeout');
      }
    }, this.opts.timeout);
  }
  this.run = this.run.bind(this);
  this.cb = this.cb.bind(this);
  this.final = this.final.bind(this);
};

BaseParallel.prototype.init = function init () {
    var this$1 = this;

  while (this.i < this.limit) {
    this$1.run(this$1.i++);
  }
};

BaseParallel.prototype.final = function final (errMsg) {
  var ref = this;
    var error = ref.error;
    var results = ref.results;
  if (this.done++) { return }
  if (error.errpos.length || errMsg) {
    if (errMsg) { error.message = errMsg; }
    this.reject(Object.assign(error, {results: results}));
  } else {
    this.resolve(results);
  }
};

BaseParallel.prototype.cb = function cb (j, err, res) {
  var ref = this;
    var error = ref.error;
    var results = ref.results;
    var opts = ref.opts;
  results[j] = res;
  error.errors[j] = err;
  if (err) {
    error.errpos.push(j);
    if (opts.bail) {
      this.final('err_bail');
      return
    }
  }
  this.l--;
  if (this.i < this.length) {
    this.run(this.i++);
  } else if (!this.l) {
    this.final();
  }
};

BaseParallel.prototype.run = function run () {};

var EachLimit = (function (BaseParallel) {
  function EachLimit (limit, items, task, opts, resolve, reject) {
    BaseParallel.call(this, limit, items.length, opts, resolve, reject);
    Object.assign(this, {items: items, task: task});
    this.init();
  }

  if ( BaseParallel ) EachLimit.__proto__ = BaseParallel;
  EachLimit.prototype = Object.create( BaseParallel && BaseParallel.prototype );
  EachLimit.prototype.constructor = EachLimit;

  EachLimit.prototype.run = function run (j) {
    var this$1 = this;

    this.task(this.items[j], j)
      .then(function (res) { return this$1.cb(j, null, res); })
      .catch(function (err) { return this$1.cb(j, err); });
  };

  return EachLimit;
}(BaseParallel));

var ParallelLimit = (function (BaseParallel) {
  function ParallelLimit (limit, tasks, opts, resolve, reject) {
    BaseParallel.call(this, limit, tasks.length, opts, resolve, reject);
    Object.assign(this, {tasks: tasks});
    this.init();
  }

  if ( BaseParallel ) ParallelLimit.__proto__ = BaseParallel;
  ParallelLimit.prototype = Object.create( BaseParallel && BaseParallel.prototype );
  ParallelLimit.prototype.constructor = ParallelLimit;

  ParallelLimit.prototype.run = function run (j) {
    var this$1 = this;

    this.tasks[j]()
      .then(function (res) { return this$1.cb(j, null, res); })
      .catch(function (err) { return this$1.cb(j, err); });
  };

  return ParallelLimit;
}(BaseParallel));

/**
* Run `items` on async `task` promise in parallel limited to `limit` running in
* parallel.
*
* Does not stop parallel execution on errors. *All tasks get executed.*
*
* @name eachLimit
* @memberOf module:parallel
* @static
* @method
* @param {Number} limit - number of tasks running in parallel
* @param {Array<any>} items - Array of items
* @param {Function} task - iterator function of type `(item: any, index: Number) => Promise`
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
function eachLimit (limit, items, task, opts) {
  return new Promise(function (resolve, reject) {
    new EachLimit(limit, items, task, opts, resolve, reject);
  })
}

/**
* Run `items` on async `task` promise in parallel.
*
* Does not stop parallel execution on errors. *All tasks get executed.*
*
* @name each
* @memberOf module:parallel
* @static
* @method
* @param {Array<any>} items - Array of items
* @param {Function} task - iterator function of type `(item: any, index: Number) => Promise`
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
* @example <caption>without errors</caption>
* each([1, 2, 3],
*   (item, index) => (
*     new Promise((resolve, reject) => {
*       resolve(item + index)
*   }))
* )
* .then((results) => {
*   console.log(results)
*   //> [1, 3, 5]
* })
*
* @example <caption>with errors</caption>
* each([1, 2, 3],
*   (item, index) => (
*     new Promise((resolve, reject) => {
*       if (index % 2) resolve(item + index)
*       else reject(new Error('error'))
*   }))
* )
* .catch((err) => { //
*   console.log(err)
*   //> { AsynccError: err
*   //>   errors: [
*   //>     Error: error,
*   //>     null,
*   //>     Error: error
*   //>   ],
*   //>   errpos: [0, 2],
*   //>   results: [undefined, 3, undefined]
*   //> }
* })
*/
function each (items, task, opts) {
  return eachLimit(0, items, task, opts)
}

/**
* Run `items` on async `task` function in series. Stops at the first error encountered.
*
* @name eachSeries
* @memberOf module:serial
* @static
* @method
* @param {Array<any>} items - Array of items
* @param {Function} task - iterator function of type `(item: any, index: Number) => Promise`
* @return {Promise} on resolve `.then(results: Array<any> => {})` and
* on reject `.catch(error => {})` where `error` is the first thrown
* error containing the properties:
* - `results: Array<Any>` returns the successfull results or undefined
*
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
*
* @example <caption>with errors</caption>
* eachSeries([1, 2, 3, 4],
*   (item, index) => (
*     new Promise((resolve, reject) => {
*       if (index !== 2) resolve(item + index)
*       else reject(new Error('error'))
*     })
*   ))
*   .catch((err) => { //
*     console.log(err)
*     //> { Error: error
*     //>   results: [ 1, 3, undefined ]
*     //> }
*   })
*/
function eachSeries (items, task) {
  return new Promise(function (resolve, reject) {
    new EachSeries(items, task, resolve, reject); // eslint-disable-line no-new
  })
}

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
function parallelLimit (limit, tasks, opts) {
  return new Promise(function (resolve, reject) {
    new ParallelLimit(limit, tasks, opts, resolve, reject);
  })
}

/**
* Run `tasks` returning Promises in parallel.
*
* Does not stop parallel execution on errors. *All tasks get executed.*
* `then()` gets called after the longest running task finishes.
*
* If bail-out on first error is desired, consider `Promise.all()` as an alternative,
* or set `{bail: true}` as option.
*
* @name parallel
* @memberOf module:parallel
* @static
* @method
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
* @example <caption>without errors</caption>
* parallel([
*   () => Promise.resolve(1),
*   () => Promise.resolve(3),
*   () => Promise.resolve(5)
* ]).then((results) => {
*   console.log(results)
*   //> [1, 3, 5]
* })
*
* @example <caption>with errors and timeout = 100ms</caption>
* parallel([
*   () => Promise.reject(new Error(1)),
*   () => Promise.resolve(3),
*   () => Promise.reject(new Error(5))
* ], {timeout: 100}).then((result) => { // won't reach here
* }).catch((err) => {
*   console.log(err)
*   //> { AsynccError:
*   //>   errors: [Error: 1, null, Error: 5],
*   //>   errpos: [0, 2],
*   //>   results: [undefined, 3, undefined]
*   //> }
* })
*/
function parallel (tasks, opts) {
  return parallelLimit(0, tasks, opts)
}

/**
* promisify async callback functions `(arg1, arg2, cb) => {}` become
* `(arg1, arg2) => Promise`
*
* @method promisify
* @static
*
* @param {Function} fn - async function using callbacks
* @return {Function} returning `Promise`
*
* @example
* const fn = (t, a, cb) => setTimeout(() => cb(a), t)
* const p = promisify(fn)
* p(10, 'a').then((res) => {
*   //> res = 'a'
* })
*/
var promisify = function (fn) { return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return (
    new Promise(function (resolve, reject) {
      fn.apply(void 0, args.concat( [function (err) {
        var res = [], len = arguments.length - 1;
        while ( len-- > 0 ) res[ len ] = arguments[ len + 1 ];

        if (err) { reject(err); }
        else { resolve.apply(void 0, res); }
      }] ));
    })
  );
 }    };

/**
* Run `task` max. `times` times. Stops at first iteration where no error is returned.
*
* Calls next `.then()` if `times` is reached or `task` returned no error,
* otherwise next `.catch()`.
*
* @name retry
* @memberOf module:serial
* @static
* @method
* @param {Number|Object} times - retry max. `times` times - default=2
* @param {Number} [times.times=2] - max. number of retries
* @param {Number} [times.lag=0] - time-lag in ms between retries
* @param {Function} task - iterator function of type `(index: Number) => Promise`
* @return {Promise}
*
* @example
* retry({times: 3, lag: 100}, // max. 3 retries with 100ms time-lag between retries
*   (index) => new Promise((resolve, reject) => {
*     let err = index < 2 ? new Error() : null
*     if (err) reject(err)
*     else resolve(index)
*   })
* ).then((res) => {
*   //> res = 2
* })
*/
function retry (times, task) {
  var opts = {};
  if (typeof times === 'object') {
    opts = times;
    times = times.times;
  }
  return new Promise(function (resolve, reject) {
    new Retry(times || 2, task, opts, resolve, reject);
  })
}

/**
* Run `tasks` functions which return a promise in series
* The function breaks after the first error encountered
*
* Can process huge number of tasks.
*
* @name series
* @memberOf module:serial
* @static
* @method
* @param {Array} tasks - Array of functions which return a Promise
* @return {Promise} on resolve `.then(results: Array<any> => {})` and
* on reject `.catch(error => {})` where `error` is the first thrown
* error containing the properties:
* - `results: Array<Any>` returns the successfull results or undefined
*
* @example <caption>without errors</caption>
* series([
*   () => Promise.resolve(1),
*   () => Promise.resolve(2),
*   () => Promise.resolve(3)
* ]).then((results) => {
*   console.log(results)
*   //> [1, 2, 3]
* })
*
* @example <caption>with errors</caption>
* series([
*   () => Promise.resolve(1),
*   () => Promise.resolve(2),
*   () => Promise.reject(new Error(3)), // breaks on first error
*   () => Promise.resolve(4)
* ]).catch((err) => { //
*   console.log(err)
*   //> { Error: 3
*   //>   results: [ 1, 2, undefined ]
*   //> }
* })
*/
function series (tasks) {
  return new Promise(function (resolve, reject) {
    new Series(tasks, resolve, reject);
  })
}

/**
* Run `task` repeatedly until number `times` is reached.
*
* Stops at the first error encountered.
* An optional `lag` between retries may be used.
*
* @name times
* @memberOf module:serial
* @static
* @method
* @param {Number|Object} times - runs `times` times. If `times < 0` then "times" cycles endlessly until an error occurs.
* @param {Number} [times.times=0] - max. number of retries
* @param {Number} [times.lag=0] - time-lag in ms between retries
* @param {Function} task - iterator function of type `(index: Number) => Promise`
* @returns {Promise}
*
* @example
* var arr = []
* return times(4,
*   (index) => new Promise((resolve) => {
*     arr.push(index)
*     resolve(index)
*   })
* ).then((res) => {
*   //> res = 3
*   //> arr = [0, 1, 2, 3]
*   assert.equal(res, 3)
*   assert.deepEqual(arr, [0, 1, 2, 3])
* })
*/
function times (times, task) {
  var opts = {};
  if (typeof times === 'object') {
    opts = times;
    times = times.times;
  }
  return new Promise(function (resolve, reject) {
    new Times(times, task, opts, resolve, reject);
  })
}

/**
* Run `task` repeatedly until `test` returns `true`.
* Calls next `.catch()` at the first error encountered.
*
* @name until
* @memberOf module:serial
* @static
* @method
* @param {Function} test - test function `(index: number) => Boolean`.
* If return value is `true` then promise gets resolved
* @param {Function} task - iterator function of type `(index: Number) => Promise`
* @return {Promise}
*
* @example
* let arr = []
* until(
*   (index) => (index >= 4),
*   (index) => new Promise((resolve) => {
*     arr.push(index)
*     resolve(index)
*   })
* ).then((res) => {
*   //> res = 3
*   //> arr = [0, 1, 2, 3]
* })
*/
function until (test, task) {
  return new Promise(function (resolve, reject) {
    new Until(test, task, {}, resolve, reject);
  })
}

/**
* Run `task` repeatedly until `test` returns `false`.
* Calls next `.catch()` at the first error encountered.
*
* @name whilst
* @memberOf module:serial
* @static
* @method
* @param {Function} test - test function `(index: number) => Boolean`.
* If return value is `false` then promise gets resolved
* @param {Function} task - iterator function of type `(index: Number) => Promise`
* @return {Promise}
*
* @example
* let arr = []
* whilst(
*   (index) => (index < 4),
*   (index) => new Promise((resolve) => {
*     arr.push(index)
*     resolve(index)
*   })
* ).then((res) => {
*   //> res = 3
*   //> arr = [0, 1, 2, 3]
* })
*/
function whilst (test, task) {
  return until(function (n) { return (!test(n)); }, task)
}

/**
* Serial execution patterns
* @module serial
*/
/**
* Parallel execution patterns
* @module parallel
*/

var index = {
  AsynccError: AsynccError,
  compose: compose,
  doUntil: doUntil,
  doWhilst: doWhilst,
  each: each,
  eachLimit: eachLimit,
  eachSeries: eachSeries,
  parallel: parallel,
  parallelLimit: parallelLimit,
  promisify: promisify,
  retry: retry,
  series: series,
  times: times,
  until: until,
  whilst: whilst
};

exports['default'] = index;
exports.AsynccError = AsynccError;
exports.compose = compose;
exports.doUntil = doUntil;
exports.doWhilst = doWhilst;
exports.each = each;
exports.eachLimit = eachLimit;
exports.eachSeries = eachSeries;
exports.parallel = parallel;
exports.parallelLimit = parallelLimit;
exports.promisify = promisify;
exports.retry = retry;
exports.series = series;
exports.times = times;
exports.until = until;
exports.whilst = whilst;

Object.defineProperty(exports, '__esModule', { value: true });

})));
