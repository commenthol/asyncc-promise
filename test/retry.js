/* global describe, it */

import assert from 'assert'
import { retry } from '..'

describe('#retry', function () {
  it('should retry min. 2 times - passing times = 0', function () {
    let arr = []
    return retry(0,
      (index) => {
        arr.push(index)
        return Promise.reject(new Error())
      }
    ).catch((err) => {
      assert.ok(err)
      assert.deepStrictEqual(arr, [0, 1])
    })
  })

  it('should retry min. 2 times - passing times = 0', function () {
    let arr = []
    return retry({ times: 0 },
      (index) => {
        arr.push(index)
        return Promise.reject(new Error())
      }
    ).catch((err) => {
      assert.ok(err)
      assert.deepStrictEqual(arr, [0, 1])
    })
  })

  it('should retry 4 times on errors', function () {
    let arr = []
    return retry(4,
      (index) => {
        arr.push(index)
        return Promise.reject(new Error())
      }
    ).catch((err) => {
      assert.ok(err)
      assert.deepStrictEqual(arr, [0, 1, 2, 3])
    })
  })

  it('should try to retry 3 times but stop on first non error', function () {
    var arr = []
    return retry(3,
      (index) => new Promise((resolve, reject) => { // task
        let err = index < 2 ? new Error() : null
        arr.push(index)
        if (err) reject(err)
        else resolve(index)
      })
    ).then((res) => { // callback
      assert.strictEqual(res, 2)
      assert.deepStrictEqual(arr, [0, 1, 2])
    })
  })

  it('should retry 1 time', function () {
    let arr = []
    return retry(1,
      (index) => {
        arr.push(index)
        return Promise.reject(new Error())
      }
    ).catch((err) => {
      assert.ok(err)
      assert.deepStrictEqual(arr, [0])
    })
  })

  it('should run with lag', function () {
    let arr = []
    let start = Date.now()
    return retry({ times: 4, lag: 10 },
      (index) => {
        arr.push(index)
        return Promise.reject(new Error())
      }
    ).catch((err) => {
      let end = Date.now() - start
      assert.ok(err)
      assert.ok(end >= 3 * 10, 'it took ' + end)
      assert.deepStrictEqual(arr, [0, 1, 2, 3])
    })
  })
})
