const {each} = require('..')

// without errors
each([1, 2, 3],
  (item, index) => (
    new Promise((resolve, reject) => {
      resolve(item + index)
    }))
).then((results) => {
  console.log(results)
  //> [1, 3, 5]
})

// with errors
each([1, 2, 3],
  (item, index) => (
    new Promise((resolve, reject) => {
      if (index % 2) resolve(item + index)
      else reject(new TypeError('error'))
    }))
).then((result) => {}) // won't reach here
  .catch((err) => {
    console.log(err)
  //> { TypeError: error
  //>   errors: [[Circular], null, TypeError: error],
  //>   errpos: [0, 2],
  //>   results: [undefined, 3, undefined]
  //> }
  })
