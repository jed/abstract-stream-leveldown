import {AbstractLevelDOWN, AbstractIterator, AbstractChainedBatch} from "abstract-leveldown"

export class LevelDOWN extends AbstractLevelDOWN {
  constructor(...args) {
    super(...args)
  }

  _get(key, options, cb) {
    let opts = {gte: key, lte: key, limit: 1}
    for (let prop in options) opts[prop] = options[prop]

    this
      ._iterator(opts)
      ._next((err, key, value) => {
        if (err) return cb(err)

        if (!key) return cb(new Error("NotFound"))

        cb(null, value)
      })
  }

  _put(key, value, options, cb) {
    this._batch([{type: "put", key, value}], options, cb)
  }

  _del(key, options, cb) {
    this._batch([{type: "del", key}], options, cb)
  }

  _batch(ops, options, cb) {
    let batch = this._chainedBatch()

    for (let {type, key, value} of ops) {
      try {
        type == "del"
          ? batch._del(key, options)
          : batch._put(key, value, options)
      }

      catch (err) { cb(err) }
    }

    batch._write(cb)
  }

  _iterator(options) {
    let rs = this._createReadStream(options)

    return new Iterator(rs)
  }

  _chainedBatch() {
    let ws = this._createWriteStream()

    return new ChainedBatch(ws)
  }
}

export class Iterator extends AbstractIterator {
  constructor(stream) {
    this._stream = stream
    this._hasEnded = false
    this._error = null

    this._stream.on("end", () => this._hasEnded = true)
    this._stream.on("error", error => this._error = error)
  }

  _next(cb) {
    if (this._error) return cb(this._error)

    let kv = this._stream.read()

    if (kv !== null) return cb(null, kv.key, kv.value)

    if (this._hasEnded) return cb()

    this._stream.once("readable", () => this._next(cb))
  }
}

export class ChainedBatch extends AbstractChainedBatch {
  constructor(stream) {
    this._stream = stream
    this._error = null

    this._stream.on("error", error => this._error = error)
  }

  _put(key, value, options) {
    this._stream.write({key, value})
  }

  _del(key, options) {
    this._put(key, undefined, options)
  }

  _clear() {
    throw new Error("Not supported.")
  }

  _write(cb) {
    this._stream.end(() => cb(this._error))
  }
}
