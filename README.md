# asyncc-promise

> Just asynchronous patterns for promises

[![NPM version](https://badge.fury.io/js/asyncc-promise.svg)](https://www.npmjs.com/package/asyncc-promise/)
[![Build Status](https://travis-ci.org/commenthol/asyncc-promise.svg?branch=master)](http://travis-ci.org/commenthol/asyncc-promise)

Runs in the browser and on node.  

The module provided follows the [asyncc][] syntax.

# Serial execution patterns

- [compose](https://commenthol.github.io/asyncc-promise/module-serial.html#.compose)
- [doUntil](https://commenthol.github.io/asyncc-promise/module-serial.html#.doUntil)
- [doWhilst](https://commenthol.github.io/asyncc-promise/module-serial.html#.doWhilst)
- [eachSeries](https://commenthol.github.io/asyncc-promise/module-serial.html#.eachSeries)
- [retry](https://commenthol.github.io/asyncc-promise/module-serial.html#.retry)
- [series](https://commenthol.github.io/asyncc-promise/module-serial.html#.series)
- [times](https://commenthol.github.io/asyncc-promise/module-serial.html#.times)
- [until](https://commenthol.github.io/asyncc-promise/module-serial.html#.until)
- [whilst](https://commenthol.github.io/asyncc-promise/module-serial.html#.whilst)

# Parallel execution patterns

- [each](https://commenthol.github.io/asyncc-promise/module-parallel.html#.each)
- [eachLimit](https://commenthol.github.io/asyncc-promise/module-parallel.html#.eachLimit)
- [parallel](https://commenthol.github.io/asyncc-promise/module-parallel.html#.parallel)
- [parallelLimit](https://commenthol.github.io/asyncc-promise/module-parallel.html#.parallelLimit)
- [allSettled](https://commenthol.github.io/asyncc-promise/module-parallel.html#.allSettled)
- [allSettledLimit](https://commenthol.github.io/asyncc-promise/module-parallel.html#.allSettledLimit)

## Installation

```sh
$ npm install asyncc-promise
```

## Tests

```sh
$ npm test
```

# Usage

As ES6 Modules

```js
import {each, eachSeries} from 'asyncc-promise'
```

As CommonJS Modules

```js
const {each, eachSeries} = require('asyncc-promise')
```

# References

<!-- !ref -->

* [asyncc][asyncc]
* [LICENSE][LICENSE]

<!-- ref! -->

[asyncc]: https://github.com/commenthol/asyncc
[LICENSE]: ./LICENSE.txt
