/* global describe, it */

import assert from 'assert'
import { Timeout } from './intern/helper'
import { eachSeries } from '..'

describe('#eachSeries', function () {
  it('eachSeries', function () {
    const t = new Timeout()
    return eachSeries(
      [14, 13, 12, 11, 10],
      (item) => t.task(item)()
    ).then((results) => {
      assert.deepStrictEqual(t.order, [14, 13, 12, 11, 10])
      assert.deepStrictEqual(results, [14, 13, 12, 11, 10])
    })
  })

  it('with errors', function () {
    const t = new Timeout()
    return eachSeries(
      [14, 13, 12, 11, 10],
      (item, index) => {
        let err
        if (index === 1) {
          err = new Error('error1')
        }
        return t.task(item, err)()
      })
      .then(() => assert.ok(true, 'should not reach here'))
      .catch((err) => {
        assert.deepStrictEqual(t.order, [14, 13])
        assert.strictEqual(err.message, 'error1')
        assert.deepStrictEqual(err.results, [14, undefined])
      })
  })

  it('can process a very huge array', function () {
    const size = 100000
    const items = new Array(size).fill(1)
    return eachSeries(items, () => Promise.resolve())
      .then((res) => {
        assert.ok(res.length === size)
      })
  })
})
