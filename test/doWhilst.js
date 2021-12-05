/* global describe, it */

import assert from 'assert'
import { doWhilst } from '..'

describe('#doWhilst', function () {
  it('should run 3 times', function () {
    let index = 3
    const arr = []
    return doWhilst(
      () => new Promise((resolve) => {
        arr.push(index++)
        resolve()
      }),
      (n) => (n < 3)
    ).then((res) => {
      assert.deepStrictEqual(arr, [3, 4, 5])
    })
  })

  it('should run endlessly', function () {
    let n = 0
    return doWhilst(
      () => new Promise((resolve, reject) => {
        if (++n >= 100) reject(new Error())
        else resolve(n)
      }),
      () => true
    ).catch((err) => {
      assert.ok(err)
    })
  })
})
