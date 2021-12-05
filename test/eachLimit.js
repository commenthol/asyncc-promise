import assert from 'assert'
import { Timeout } from './intern/helper'
import { eachLimit } from '..'

describe('#eachLimit', function () {
  const items = [40, 31, 22, 3, 14]

  it('should run parallel limited tasks', function () {
    const t = new Timeout()
    return eachLimit(2, items, (item, cb) => t.task(item)())
      .then((res) => {
        // assert.deepStrictEqual(t.order, [31, 40, 3, 22, 14]) // correct order of processing is not guaranteed
        assert.deepStrictEqual(res, items)
      })
  })

  it('should cope with errors', function () {
    const t = new Timeout()
    return eachLimit(2, items,
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
        // assert.deepStrictEqual(t.order, [31, 40, 3, 22, 14]) // correct order of processing is not guaranteed
        assert.deepStrictEqual(err.errors, [null, 'error1', null, 'error2', null])
        assert.deepStrictEqual(err.results, [40, undefined, 22, undefined, 14])
        assert.deepStrictEqual(err.errpos, [1, 3])
      })
  })

  it('should bail out on first error', function () {
    const t = new Timeout()
    return eachLimit(2, items,
      (item, index) => {
        let err
        if (index === 1) {
          err = 'error1'
        } else if (index === 3) {
          err = 'error2'
        }
        return t.task(item, err)()
      }, { bail: true })
      .then(() => assert.ok(true, 'should not reach here'))
      .catch((err) => {
        // assert.deepStrictEqual(t.order, [31, 40, 3, 22, 14]) // correct order of processing is not guaranteed
        assert.deepStrictEqual(err.errors, [null, 'error1', null, null, null])
        assert.deepStrictEqual(err.results, [undefined, undefined, undefined, undefined, undefined])
        assert.deepStrictEqual(err.errpos, [1])
      })
  })

  it('should end with timeout error', function () {
    const t = new Timeout()
    return eachLimit(2, items, (item, cb) => t.task(item)(), { timeout: 35 })
      .then(() => {
        assert.ok(false, 'should not reach here')
      })
      .catch((err) => {
        assert.ok(err)
        assert.deepStrictEqual(err.errors, [null, null, null, null, null])
        assert.deepStrictEqual(err.results, [undefined, 31, undefined, undefined, undefined])
        assert.deepStrictEqual(err.errpos, [])
      })
  })

  it('should end on empty list', function () {
    const t = new Timeout()
    return eachLimit(2, [], (item, cb) => t.task(item)())
      .then((res) => {
        assert.deepStrictEqual(res, [])
      })
  })
/* // TODO
  it.skip('fs.stat', function (done) {
    compose(
      fs.readdir,
      function (files, cb) {
        cb(null, files.map((file) => (path.join(__dirname, file))))
      },
      function (files, cb) {
        eachLimit(3, files, fs.stat, (err, stats) => {
          stats = (stats || []).map((stat, i) => {
            stat.file = files[i]
            return stat
          })
          cb(err, stats)
        })
      }
    )(__dirname, function (err, res) {
      // console.log(res)
      assert.strictEqual(err, null)
      assert.ok(res.length > 1)
      done()
    })
  })
*/
})
