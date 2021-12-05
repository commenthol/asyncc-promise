import assert from 'assert'
import { Timeout } from './intern/helper'
import { parallel } from '..'

describe('#parallel', function () {
  it('parallel', function () {
    const t = new Timeout()
    return parallel([
      t.task(40),
      t.task(31),
      t.task(22),
      t.task(13),
      t.task(4)
    ]).then((res) => {
      assert.deepStrictEqual(t.order, [4, 13, 22, 31, 40])
      assert.deepStrictEqual(res, [40, 31, 22, 13, 4])
    })
  })

  it('with errors', function () {
    const t = new Timeout()
    return parallel([
      t.task(40),
      t.task(31, 'error1'),
      t.task(22),
      t.task(13, 'error2'),
      t.task(4)
    ]).then(() => {
      assert.ok(false)
    }).catch((err) => {
      assert.deepStrictEqual(t.order, [4, 13, 22, 31, 40])
      assert.deepStrictEqual(err.errors, [null, 'error1', null, 'error2', null])
      assert.deepStrictEqual(err.results, [40, undefined, 22, undefined, 4])
      assert.deepStrictEqual(err.errpos, [3, 1])
    })
  })
})
