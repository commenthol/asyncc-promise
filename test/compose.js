/* global describe, it */
/* eslint prefer-promise-reject-errors: 0 */

import assert from 'assert'
import {compose} from '..'

describe('#compose', function () {
  const step = (arg) => new Promise((resolve) => {
    arg.value++
    resolve(arg)
  })

  it('compose', function () {
    let arg = {value: 0}
    compose(
      step,
      step,
      step
    )(arg).then((res) => {
      assert.ok(arg === res) // are the same object
      assert.deepEqual(res, {value: 3})
    })
  })

  it('with errors', function () {
    let arg = {value: 0}
    compose([
      step,
      step,
      () => Promise.reject('error'),
      step
    ])(arg).catch((err) => {
      assert.equal(err.message, 'error')
      assert.deepEqual(arg, {value: 2})
    })
  })
})
