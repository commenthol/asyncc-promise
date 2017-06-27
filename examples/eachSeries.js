const {
  eachSeries
} = require('..')

// without errors
eachSeries([1, 2, 3, 4],
  (item, index) => (
    new Promise((resolve, reject) => {
      resolve(item + index)
    })
  ))
  .then((results) => {
    console.log(results)
    //> [1, 3, 5, 7]
  })

// with errors
eachSeries([1, 2, 3, 4],
  (item, index) => (
    new Promise((resolve, reject) => {
      if (index !== 2) resolve(item + index)
      else reject(new TypeError('error'))
    })
  ))
  .catch((err) => { //
    console.log(err)
    //> { TypeError: error
    //>   results: [ 1, 3, undefined ]
    //> }
  })
