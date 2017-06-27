/* global describe, it */

import assert from 'assert'
import {Timeout} from './src/helper'
import {each} from '..'

describe('#each', function () {
  const items = [40, 31, 22, 13, 4]

  it('each', function () {
    let t = new Timeout()
    return each(items,
      (item) => t.task(item)
    ).then((res) => {
      assert.deepEqual(t.order, [4, 13, 22, 31, 40])
      assert.deepEqual(res, items)
    })
  })

  it('with errors', function () {
    let t = new Timeout()
    return each(items,
      (item, index) => {
        let err
        if (index === 1) {
          err = 'error1'
        } else if (index === 3) {
          err = 'error2'
        }
        return t.task(item, err)
      })
      .then(() => assert.ok(true, 'should not reach here'))
      .catch((err) => {
        // console.log(err)
        assert.deepEqual(t.order, [4, 13, 22, 31, 40])
        assert.deepEqual(err.errors, [null, 'error1', null, 'error2', null])
        assert.deepEqual(err.results, [ 40, undefined, 22, undefined, 4 ])
        assert.deepEqual(err.errpos, [3, 1])
      })
  })
})
