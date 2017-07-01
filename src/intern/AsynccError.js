export default class AsynccError extends Error {
  constructor (message, errors, errpos, results) {
    super(message)
    this.name = 'AsynccError'
    this.errors = errors
    this.errpos = errpos
    if (results) this.results = results
  }
}
