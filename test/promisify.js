import assert from 'assert'
import { promisify } from '..'

describe('#promisify', function () {
  it('should promisify callback', function () {
    const fn = (timeout, payload, cb) =>
      setTimeout(() => cb(null, payload), timeout)

    const promise = promisify(fn)
    return promise(10, 'a').then((res) => {
      //> res = 'a'
      assert.strictEqual(res, 'a')
    })
  })

  it('should promisify callback with error', function () {
    const fn = (timeout, err, cb) =>
      setTimeout(() => cb(err), timeout)

    const promise = promisify(fn)
    return promise(10, new Error('bad'))
      .then(() => {
        assert.ok(false, 'should not reach here')
      })
      .catch((err) => {
        assert.ok(err)
        assert.strictEqual(err.message, 'bad')
      })
  })
})
