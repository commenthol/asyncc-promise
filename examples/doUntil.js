const {doUntil} = require('..')

// without errors
doUntil(
  (i) => Promise.resolve(i),
  (i) => i > 5
).then((res) => {
  console.log(res)
  //> 5
})

// with errors
doUntil(
  (i) => new Promise((resolve, reject) => {
    if (i < 3) resolve(i)
    else reject(new Error(i))
  }),
  (i) => i > 5
).then((res) => {
  console.log(res)
  //> 5
}).catch((err) => {
  console.log(err)
  //> Error: 3 // bails out on first error
})
