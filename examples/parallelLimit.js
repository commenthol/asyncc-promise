const { parallelLimit } = require('..')

// without errors
parallelLimit(2, [
  () => Promise.resolve(1),
  () => Promise.resolve(3),
  () => Promise.resolve(5)
]).then((results) => {
  console.log('#wo errors', results)
  //> [1, 3, 5]
})

// with errors
parallelLimit(2, [
  () => Promise.reject(new Error(1)),
  () => Promise.resolve(3),
  () => Promise.reject(new Error(5))
]).then((result) => { // won't reach here
}).catch((err) => {
  console.log('#w errors', err)
  //> { AsynccError:
  //>   errors: [Error: 1, null, Error: 5],
  //>   errpos: [0, 2],
  //>   results: [undefined, 3, undefined]
  //> }
})

// bail out on first error
parallelLimit(2, [
  () => Promise.reject(new Error(1)),
  () => new Promise((resolve) => setTimeout(() => resolve(3), 1)),
  () => new Promise((resolve) => setTimeout(() => resolve(5), 1))
], { bail: true }).then((result) => { // won't reach here
}).catch((err) => {
  console.log('#bail', err)
  //> { AsynccError: err_bail
  //>   errors: [Error: 1, undefined, undefined],
  //>   errpos: [0],
  //>   results: [undefined, undefined, undefined]
  //> }
})

// timeout
parallelLimit(2, [
  () => new Promise((resolve) => {}),
  () => new Promise((resolve) => {}),
  () => new Promise((resolve) => {})
], { timeout: 1 }).then((result) => { // won't reach here
}).catch((err) => {
  console.log('#timeout', err)
  //> { AsynccError: err_timeout
  //>   errors: [undefined, undefined, undefined],
  //>   errpos: [],
  //>   results: [undefined, undefined, undefined]
  //> }
})
