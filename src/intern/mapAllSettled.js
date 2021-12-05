const FULLFILLED = 'fullfilled'
const REJECTED = 'rejected'

/** @typedef {import('../types').Status} Status */

/**
 * @typedef {object} ResultsOrError
 * @property {Error[]} errors
 * @property {number[]} errpos
 * @property {any[]} results
 */

/**
 * @internal
 * @param {ResultsOrError|any[]} resultsOrErr
 * @param {boolean} [isCatched]
 * @returns {Status[]}
 */
export function mapAllSettled (resultsOrErr, isCatched) {
  if (!isCatched) {
    // @ts-ignore
    return resultsOrErr.map(value => ({ status: FULLFILLED, value }))
  } else {
    // @ts-ignore
    const { errors, errpos, results } = resultsOrErr
    return results.map((value, i) => errpos.includes(i)
      ? { status: REJECTED, reason: errors[i] }
      : { status: FULLFILLED, value }
    )
  }
}
