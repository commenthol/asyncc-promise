/**
* Serial execution patterns
* @module serial
*/
/**
* Parallel execution patterns
* @module parallel
*/

import AsynccError from './intern/AsynccError'

import compose from './compose.js'
import doUntil from './doUntil.js'
import doWhilst from './doWhilst.js'
import each from './each.js'
import eachLimit from './eachLimit.js'
import eachSeries from './eachSeries.js'
import parallel from './parallel.js'
import parallelLimit from './parallelLimit.js'
import allSettled from './allSettled.js'
import allSettledLimit from './allSettledLimit.js'
import { promisify } from './promisify.js'
import retry from './retry.js'
import series from './series.js'
import times from './times.js'
import until from './until.js'
import whilst from './whilst.js'

export default {
  allSettled,
  allSettledLimit,
  AsynccError,
  compose,
  doUntil,
  doWhilst,
  each,
  eachLimit,
  eachSeries,
  parallel,
  parallelLimit,
  promisify,
  retry,
  series,
  times,
  until,
  whilst
}

export {
  allSettled,
  allSettledLimit,
  AsynccError,
  compose,
  doUntil,
  doWhilst,
  each,
  eachLimit,
  eachSeries,
  parallel,
  parallelLimit,
  promisify,
  retry,
  series,
  times,
  until,
  whilst
}
