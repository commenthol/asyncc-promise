/* global describe, it */

import assert from 'assert'
import { Timeout } from './intern/helper'
import { series } from '..'
require('core-js/es6/array.js')

describe('#series', function () {
  it('sync series', function () {
    return series([
      () => Promise.resolve(5),
      () => Promise.resolve(4),
      () => Promise.resolve(3),
      () => Promise.resolve(2)
    ]).then((res) => {
      assert.deepStrictEqual(res, [5, 4, 3, 2, 1])
    }).catch(() => {})
  })

  it('async series', function () {
    let t = new Timeout()
    return series([
      t.task(14),
      t.task(13),
      t.task(12),
      t.task(11),
      t.task(10)
    ]).then((res) => {
      assert.deepStrictEqual(res, [14, 13, 12, 11, 10])
    }).catch(() => {})
  })

  it('with errors', function () {
    let t = new Timeout()
    return series([
      t.task(14),
      t.task(13, new Error('error1')),
      t.task(12),
      t.task(11, new Error('error2')),
      t.task(10)
    ]).then((res) =>
      assert.ok(false)
    ).catch((err) => {
      assert.deepStrictEqual(err.message, 'error1')
      assert.deepStrictEqual(err.results, [14, undefined])
    })
  })

  it('can process a very huge array', function () {
    var size = 100000
    const tsk = () => Promise.resolve()
    var tasks = new Array(size).fill(tsk)
    return series(tasks)
      .then((res) => {
        assert.ok(res.length === size)
      })
  })
})
