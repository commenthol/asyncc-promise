const { eachLimit } = require('..')

// without errors
eachLimit(2, [1, 2, 3, 4],
  (item, index) => (
    new Promise((resolve, reject) => {
      resolve(item + index)
    })
  )
).then((results) => {
  console.log(results)
  //> [1, 3, 5, 7]
})

// with errors
eachLimit(2, [1, 2, 3, 4],
  (item, index) => (
    new Promise((resolve, reject) => {
      if (index % 2) resolve(item + index)
      else reject(new TypeError('error' + index))
    })
  )
).catch((err) => { //
  console.log(err)
  //> { AsynccError
  //>   errors: [TypeError: error0, null, TypeError: error2, null],
  //>   errpos: [0, 2],
  //>   results: [undefined, 3, undefined, 7]
  //> }
})
