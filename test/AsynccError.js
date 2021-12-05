import assert from 'assert'
import { AsynccError } from '..'

describe('#AsynccError', function () {
  it('should create instance', function () {
    const msg = 'test'
    const errors = ['err1', null, 'err2']
    const errpos = [0, 2]
    const err = new AsynccError(msg, errors, errpos)
    assert.ok(err)
    assert.ok(err.stack)
    assert.strictEqual(err.message, msg)
    assert.deepStrictEqual(err.errors, errors)
    assert.deepStrictEqual(err.errpos, errpos)
    assert.ok(!err.results)
  })

  it('should create instance with results', function () {
    const msg = 'test'
    const errors = ['err1', null, 'err2']
    const errpos = [0, 2]
    const results = [undefined, 3, undefined]
    const err = new AsynccError(msg, errors, errpos, results)
    assert.ok(err)
    assert.ok(err.stack)
    assert.strictEqual(err.message, msg)
    assert.deepStrictEqual(err.errors, errors)
    assert.deepStrictEqual(err.errpos, errpos)
    assert.deepStrictEqual(err.results, results)
  })
})
