/* global describe, it */

// import fs from 'fs'
// import path from 'path'
import assert from 'assert'
import {Timeout} from './src/helper'
import {eachLimit} from '..'

describe('#eachLimit', function () {
  let items = [40, 31, 22, 3, 14]
  it('eachLimit', function () {
    let t = new Timeout()
    return eachLimit(2, items, (item, cb) => t.task(item))
      .then((res) => {
        // assert.deepEqual(t.order, [31, 40, 3, 22, 14]) // correct order of processing is not guaranteed
        assert.deepEqual(res, items)
      })
  })
  it('with errors', function () {
    let t = new Timeout()
    return eachLimit(2, items,
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
        // assert.deepEqual(t.order, [31, 40, 3, 22, 14]) // correct order of processing is not guaranteed
        assert.deepEqual(err.errors, [null, 'error1', null, 'error2', null])
        assert.deepEqual(err.results, [40, undefined, 22, undefined, 14])
        assert.deepEqual(err.errpos, [1, 3])
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
      assert.equal(err, null)
      assert.ok(res.length > 1)
      done()
    })
  })
*/
})
