import inherits from 'inherits'
import assign from 'object-assign'
import AbstractLevelDOWN from 'abstract-leveldown/abstract-leveldown'

import AbstractStreamIterator from './abstract-stream-iterator'
import AbstractStreamChainedBatch from './abstract-stream-chained-batch'

function AbstractStreamLevelDOWN (location) {
  if (!(this instanceof AbstractStreamLevelDOWN))
    return new AbstractStreamLevelDOWN(location)

  AbstractLevelDOWN.call(this, location)
}
inherits(AbstractStreamLevelDOWN, AbstractLevelDOWN)
assign(AbstractStreamLevelDOWN.prototype, {
  _get (key, options, cb) {
    var opts = {gte: key, lte: key, limit: 1}
    for (var prop in options) opts[prop] = options[prop]

    this
      ._iterator(opts)
      ._next(function (err, key, value) {
        if (err) return cb(err)

        if (!key) return cb(new Error("NotFound"))

        cb(null, value)
      })
  },

  _put (key, value, options, cb) {
    this._batch([{type: "put", key, value}], options, cb)
  },

  _del (key, options, cb) {
    this._batch([{type: "del", key}], options, cb)
  },

  _batch (ops, options, cb) {
    var batch = this._chainedBatch()

    ops.forEach((op) => {
      try {
        op.type == "del"
          ? batch._del(op.key, options)
          : batch._put(op.key, op.value, options)
      }

      catch (err) { cb(err) }
    })

    batch._write(cb)
  },

  _iterator (options) {
    var rs = this._createReadStream(options)

    return new AbstractStreamIterator(rs)
  },

  _chainedBatch () {
    var ws = this._createWriteStream()

    return new AbstractStreamChainedBatch(ws)
  }
})

module.exports = AbstractStreamLevelDOWN
