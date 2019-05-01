const { until } = require('..')

// without errors
until(
  (i) => i > 5,
  (i) => Promise.resolve(i)
).then((res) => {
  console.log(res)
  //> 5
})

// with errors
until(
  (i) => i > 5,
  (i) => new Promise((resolve, reject) => {
    if (i < 3) resolve(i)
    else reject(new Error(i))
  })
).then((res) => {
  console.log(res)
  //> 5
}).catch((err) => {
  console.log(err)
  //> Error: 3 // bails out on first error
})
