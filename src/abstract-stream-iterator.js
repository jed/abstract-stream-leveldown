import inherits from 'inherits'
import assign from 'object-assign'
import AbstractIterator from 'abstract-leveldown/abstract-iterator'

function AbstractStreamIterator (stream) {
  this._stream = stream
  this._hasEnded = false
  this._error = null

  this._stream.on('end', () => {
    this._hasEnded = true
    this._check()
  })

  this._stream.on('error', () => {
    this._error = err
    this._check()
  })
}
inherits(AbstractStreamIterator, AbstractIterator)
assign(AbstractStreamIterator.prototype, {
  _next (cb) {
    this._cb = cb
    this._check()
  },

  _check () {
    if (this._error) return setImmediate(this._cb, this._error)

    var kv = this._stream.read()

    if (kv !== null) return setImmediate(this._cb, null, kv.key, kv.value)

    if (this._hasEnded) return setImmediate(this._cb)

    this._stream.once('readable', () => { this._check() })
  }
})

module.exports = AbstractStreamIterator
