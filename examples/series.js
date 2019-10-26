const { series: series1 } = require('..')

/**
* This series implementation has drawbacks if processing huge arrays
*/
const series2 = (tasks) => // eslint-disable-line no-unused-vars
  tasks.reduce((prev, curr) => (
    prev.then((results) =>
      curr()
        .then((r) => results.concat(r))
        .catch((err) => {
          err = typeof err === 'object' ? err : new Error(err)
          Object.assign(err, { results })
          throw err
        })
    )
  ), Promise.resolve([]))

// Try! Change to series2
const series = series1

// without errors
series([
  () => Promise.resolve(1),
  () => Promise.resolve(2),
  () => Promise.resolve(3)
]).then((results) => {
  console.log(results)
  //> [1, 2, 3]
})

// with errors
series([
  () => Promise.resolve(1),
  () => Promise.resolve(2),
  () => Promise.reject(new Error(3)), // breaks on first error
  () => Promise.resolve(4)
]).catch((err) => { //
  console.log(err)
  //> { Error: 3
  //>   results: [ 1, 2, undefined ]
  //> }
})

// huge array
series(new Array(100000).fill(() => Promise.resolve()))
  .then((res) => {
    console.log(res.length)
  })
