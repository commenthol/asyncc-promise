/**
* Serial execution patterns
* @module serial
*/
/**
* Parallel execution patterns
* @module parallel
*/

import AsynccError from './intern/AsynccError'

import compose from './compose'
import doUntil from './doUntil'
import doWhilst from './doWhilst'
import each from './each'
import eachLimit from './eachLimit'
import eachSeries from './eachSeries'
import parallel from './parallel'
import parallelLimit from './parallelLimit'
import { promisify } from './promisify'
import retry from './retry'
import series from './series'
import times from './times'
import until from './until'
import whilst from './whilst'

export default {
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
