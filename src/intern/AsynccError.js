export default class AsynccError extends Error {
  constructor (message, errors, errpos, results) {
    super(message)
    Object.assign(this, {
      name: 'AsynccError',
      message,
      errors,
      errpos,
      results,
      stack: this.stack || new Error().stack
    })
  }
}
