const {parallel} = require('..')

// without errors
parallel([
  () => Promise.resolve(1),
  () => Promise.resolve(3),
  () => Promise.resolve(5)
]).then((results) => {
  console.log(results)
  //> [1, 3, 5]
})

// with errors
parallel([
  () => Promise.reject(new Error(1)),
  () => Promise.resolve(3),
  () => Promise.reject(new Error(5))
]).then((result) => { // won't reach here
}).catch((err) => {
  console.log(err)
  //> { AsynccError:
  //>   errors: [Error: 1, null, Error: 5],
  //>   errpos: [0, 2],
  //>   results: [undefined, 3, undefined]
  //> }
})
