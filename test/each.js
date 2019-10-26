/* global describe, it */

import assert from 'assert'
import { Timeout } from './intern/helper'
import { each } from '..'

describe('#each', function () {
  const items = [40, 31, 22, 13, 4]

  it('each', function () {
    const t = new Timeout()
    return each(items,
      (item) => t.task(item)()
    ).then((res) => {
      assert.deepStrictEqual(t.order, [4, 13, 22, 31, 40])
      assert.deepStrictEqual(res, items)
    })
  })

  it('with errors', function () {
    const t = new Timeout()
    return each(items,
      (item, index) => {
        let err
        if (index === 1) {
          err = 'error1'
        } else if (index === 3) {
          err = 'error2'
        }
        return t.task(item, err)()
      })
      .then(() => assert.ok(true, 'should not reach here'))
      .catch((err) => {
        // console.log(err)
        assert.deepStrictEqual(t.order, [4, 13, 22, 31, 40])
        assert.deepStrictEqual(err.errors, [null, 'error1', null, 'error2', null])
        assert.deepStrictEqual(err.results, [40, undefined, 22, undefined, 4])
        assert.deepStrictEqual(err.errpos, [3, 1])
      })
  })
})
