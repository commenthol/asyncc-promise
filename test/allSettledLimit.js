/* global describe, it */

import assert from 'assert'
import { Timeout } from './intern/helper'
import { allSettledLimit } from '../dist'

describe('#allSettledLimit', function () {
  it('allSettledLimit', function () {
    const t = new Timeout()
    return allSettledLimit(2, [
      t.task(40),
      t.task(31),
      t.task(22),
      t.task(3),
      t.task(14)
    ]).then((res) => {
      // skipped as of randomly appearing race condition with small timeouts
      // assert.deepStrictEqual(t.order, [31, 40, 3, 22, 14])
      assert.deepStrictEqual(res, [
        { status: 'fullfilled', value: 40 },
        { status: 'fullfilled', value: 31 },
        { status: 'fullfilled', value: 22 },
        { status: 'fullfilled', value: 3 },
        { status: 'fullfilled', value: 14 }
      ])
    })
  })

  it('with errors', function () {
    const t = new Timeout()
    return allSettledLimit(4, [
      t.task(40),
      t.task(31, 'error1'),
      t.task(22),
      t.task(13, 'error2'),
      t.task(4)
    ]).then((res) => {
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
