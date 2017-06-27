/**
* Serial execution patterns
* @module serial
*/
/**
* Parallel execution patterns
* @module parallel
*/

import {_setImmediate} from './_setImmediate'

import each from './each'
import eachLimit from './eachLimit'
import eachSeries from './eachSeries'

export default {
  _setImmediate,
  each,
  eachLimit,
  eachSeries
}

export {
  _setImmediate,
  each,
  eachLimit,
  eachSeries
}
