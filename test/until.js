import assert from 'assert'
import { until } from '..'

describe('#until', function () {
  it('should run until condition returns true', function () {
    const arr = []
    return until(
      (index) => (index >= 4),
      (index) => new Promise((resolve) => {
        arr.push(index)
        resolve(index)
      })
    ).then((res) => {
      //> res = 3
      //> arr = [0, 1, 2, 3]
      assert.strictEqual(res, 3)
      assert.deepStrictEqual(arr, [0, 1, 2, 3])
    })
  })

  it('should immediately exit with callback if test is true', function () {
    const arr = []
    return until(
      () => true,
      (index) => new Promise((resolve) => {
        arr.push(index)
        resolve(index)
      })
    ).then((res) => {
      assert.strictEqual(res, undefined)
      assert.deepStrictEqual(arr, [])
    })
  })
})
