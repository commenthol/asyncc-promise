/* global describe, it */
/* eslint standard/no-callback-literal:0 */

import assert from 'assert'
import { times } from '..'

describe('#times', function () {
  it('should run 4 times', function () {
    var arr = []
    return times(4,
      (index) => new Promise((resolve) => {
        setTimeout(() => {
          arr.push(index)
          resolve(index)
        })
      })
    ).then((res) => {
      //> res = 3
      //> arr = [0, 1, 2, 3]
      assert.strictEqual(res, 3)
      assert.deepStrictEqual(arr, [0, 1, 2, 3])
    })
  })

  it('should exit on error', function () {
    const arr = []
    return times(4,
      (index) => new Promise((resolve, reject) => {
        if (index === 2) {
          reject(new Error('error'))
        } else {
          arr.push(index)
          resolve(index)
        }
      })
    ).catch((err) => {
      assert.deepStrictEqual(err.message, 'error')
      assert.deepStrictEqual(arr, [0, 1])
    })
  })

  it('should run zero times', function () {
    return times(0,
      (index) => Promise.reject(new Error('error'))
    ).then((res) => {
      assert.strictEqual(res, undefined)
    }).catch(() => {
      assert.ok(false)
    })
  })

  it('should run endlessly', function () {
    return times(-1,
      (index) => new Promise((resolve, reject) => {
        if (index >= 1000) { // we stop the test after 1000 cycles
          reject(index)
        } else {
          resolve(index)
        }
      })
    ).catch((err) => {
      assert.strictEqual(err.message, '1000')
    })
  })

  it('should process large number of cycles', function () {
    var size = 10000
    return times(size,
      (i) => Promise.resolve(i)
    ).then((res) => {
      assert.ok(res === size - 1)
    })
  })

  it('should run with lag', function () {
    const arr = []
    const start = Date.now()
    return times({ times: 4, lag: 10 },
      (index) => new Promise((resolve) => {
        arr.push(index)
        resolve(index)
      })
    ).then((res) => {
      const end = Date.now() - start
      assert.strictEqual(res, 3)
      assert.ok(end >= 3 * 10, 'it took ' + end)
      assert.deepStrictEqual(arr, [0, 1, 2, 3])
    })
  })
})
