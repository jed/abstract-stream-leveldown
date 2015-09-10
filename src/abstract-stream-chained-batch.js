import inherits from 'inherits'
import assign from 'object-assign'
import AbstractChainedBatch from 'abstract-leveldown/abstract-chained-batch'

function AbstractStreamChainedBatch (stream) {
  this._stream = stream
  this._error = null

  this._stream.on('error', (err) => { this._error = err })
}
inherits(AbstractStreamChainedBatch, AbstractChainedBatch)
assign(AbstractStreamChainedBatch.prototype, {
  _put (key, value, options) {
    this._stream.write({key, value})
  },

  _del (key, options) {
    this._put(key, undefined, options)
  },

  _clear () {
    throw new Error("Not supported.")
  },

  _write (cb) {
    this._stream.end(() => { cb(this._error) })
  }
})

module.exports = AbstractStreamChainedBatch
