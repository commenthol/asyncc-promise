const {whilst} = require('..')

let arr = []
whilst(
  (index) => index < 4,
  (index) => new Promise((resolve) => {
    arr.push(index)
    resolve(index)
  })
).then((res) => {
  console.log(res, arr)
  //> res = 3
  //> arr = [0, 1, 2, 3]
})
