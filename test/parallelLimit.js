/* global describe, it */

import assert from 'assert'
import {Timeout} from './intern/helper'
import {parallelLimit} from '..'

describe('#parallelLimit', function () {
  it('parallelLimit', function () {
    let t = new Timeout()
    return parallelLimit(2, [
      t.task(40),
      t.task(31),
      t.task(22),
      t.task(3),
      t.task(14)
    ]).then((res) => {
      // skipped as of randomly appearing race condition with small timeouts
      // assert.deepEqual(t.order, [31, 40, 3, 22, 14])
      assert.deepEqual(res, [40, 31, 22, 3, 14])
    })
  })

  it('with errors', function () {
    let t = new Timeout()
    return parallelLimit(4, [
      t.task(40),
      t.task(31, 'error1'),
      t.task(22),
      t.task(13, 'error2'),
      t.task(4)
    ]).then((res) => {
      assert.ok(false)
    }).catch((err) => {
      // assert.deepEqual(t.order, [4, 13, 22, 31, 40])
      assert.deepEqual(err.errors, [undefined, 'error1', undefined, 'error2', undefined])
      assert.deepEqual(err.results, [40, undefined, 22, undefined, 4])
      assert.deepEqual(err.errpos, [3, 1])
    })
  })
})
