import assert from 'assert'
import { Timeout } from './intern/helper'
import { allSettled } from '../dist'

describe('#allSettled', function () {
  it('allSettled', function () {
    const t = new Timeout()
    return allSettled([
      t.task(40),
      t.task(31),
      t.task(22),
      t.task(13),
      t.task(4)
    ]).then((res) => {
      assert.deepStrictEqual(t.order, [4, 13, 22, 31, 40])
      assert.deepStrictEqual(res, [
        { status: 'fullfilled', value: 40 },
        { status: 'fullfilled', value: 31 },
        { status: 'fullfilled', value: 22 },
        { status: 'fullfilled', value: 13 },
        { status: 'fullfilled', value: 4 }
      ])
    })
  })

  it('with errors', function () {
    const t = new Timeout()
    return allSettled([
      t.task(40),
      t.task(31, 'error1'),
      t.task(22),
      t.task(13, 'error2'),
      t.task(4)
    ]).then((res) => {
      assert.deepStrictEqual(t.order, [4, 13, 22, 31, 40])
      assert.deepStrictEqual(res, [
        { status: 'fullfilled', value: 40 },
        { status: 'rejected', reason: 'error1' },
        { status: 'fullfilled', value: 22 },
        { status: 'rejected', reason: 'error2' },
        { status: 'fullfilled', value: 4 }
      ])
    })
  })
})
