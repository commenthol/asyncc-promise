/* global describe, it */

import assert from 'assert'
import {whilst} from '..'

describe('#whilst', function () {
  it('should run until condition returns false', function () {
    var arr = []
    return whilst(
      (index) => (index < 4),
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

  it('should run endlessly', function () {
    return whilst(
      () => true,
      (index) => new Promise((resolve, reject) => {
        if (index >= 10000) { // we stop the test after 10000 cycles
          reject(new Error(index))
        } else {
          resolve()
        }
      })
    ).catch((err) => {
      assert.equal(err.message, 10000)
    })
  })
})