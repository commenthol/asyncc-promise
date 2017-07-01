/* global describe, it */

import assert from 'assert'
import {until} from '..'

describe('#until', function () {
  it('should run until condition returns true', function () {
    var arr = []
    return until(
      (index) => (index >= 4),
      (index) => new Promise((resolve) => {
        arr.push(index)
        resolve(index)
      })
    ).then((res) => {
      //> res = 3
      //> arr = [0, 1, 2, 3]
      assert.equal(res, 3)
      assert.deepEqual(arr, [0, 1, 2, 3])
    })
  })

  it('should immediately exit with callback if test is true', function () {
    var arr = []
    return until(
      () => true,
      (index) => new Promise((resolve) => {
        arr.push(index)
        resolve(index)
      })
    ).then((res) => {
      assert.equal(res, undefined)
      assert.deepEqual(arr, [])
    })
  })
})
