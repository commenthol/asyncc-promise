/* global describe, it */

import assert from 'assert'
import { doUntil } from '..'

describe('#doUntil', function () {
  it('should run 3 times', function () {
    var index = 3
    var arr = []
    return doUntil(
      () => new Promise((resolve) => {
        arr.push(index++)
        resolve()
      }),
      (n) => (n >= 3)
    ).then((res) => {
      assert.deepStrictEqual(arr, [3, 4, 5])
    })
  })

  it('should run endlessly', function () {
    let n = 0
    return doUntil(
      () => new Promise((resolve, reject) => {
        if (++n >= 100) reject(new Error())
        else resolve(n)
      }),
      () => false
    ).catch((err) => {
      assert.ok(err)
    })
  })
})
