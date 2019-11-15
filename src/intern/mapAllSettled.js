const FULLFILLED = 'fullfilled'
const REJECTED = 'rejected'

export function mapAllSettled (resultsOrErr, isCatched) {
  if (!isCatched) {
    return resultsOrErr.map(value => ({ status: FULLFILLED, value }))
  } else {
    const { errors, errpos, results } = resultsOrErr
    return results.map((value, i) => errpos.includes(i)
      ? { status: REJECTED, reason: errors[i] }
      : { status: FULLFILLED, value }
    )
  }
}
