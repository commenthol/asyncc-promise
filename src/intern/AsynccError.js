export default class AsynccError extends Error {
  /**
   * @param {string} message
   * @param {Error[]} errors
   * @param {number[]} errpos
   * @param {any[]} [results]
   */
  constructor (message, errors, errpos, results) {
    super(message)
    this.name = 'AsynccError'
    this.message = message
    this.errors = errors
    this.errpos = errpos
    this.results = results
    this.stack = this.stack || new Error().stack
  }
}
