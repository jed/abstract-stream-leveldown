'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _abstractLeveldownAbstractLeveldown = require('abstract-leveldown/abstract-leveldown');

var _abstractLeveldownAbstractLeveldown2 = _interopRequireDefault(_abstractLeveldownAbstractLeveldown);

var _abstractStreamIterator = require('./abstract-stream-iterator');

var _abstractStreamIterator2 = _interopRequireDefault(_abstractStreamIterator);

var _abstractStreamChainedBatch = require('./abstract-stream-chained-batch');

var _abstractStreamChainedBatch2 = _interopRequireDefault(_abstractStreamChainedBatch);

function AbstractStreamLevelDOWN(location) {
  if (!(this instanceof AbstractStreamLevelDOWN)) return new AbstractStreamLevelDOWN(location);

  _abstractLeveldownAbstractLeveldown2['default'].call(this, location);
}
(0, _inherits2['default'])(AbstractStreamLevelDOWN, _abstractLeveldownAbstractLeveldown2['default']);
(0, _objectAssign2['default'])(AbstractStreamLevelDOWN.prototype, {
  _get: function _get(key, options, cb) {
    var opts = { gte: key, lte: key, limit: 1 };
    for (var prop in options) opts[prop] = options[prop];

    this._iterator(opts)._next(function (err, key, value) {
      if (err) return cb(err);

      if (!key) return cb(new Error("NotFound"));

      cb(null, value);
    });
  },

  _put: function _put(key, value, options, cb) {
    this._batch([{ type: "put", key: key, value: value }], options, cb);
  },

  _del: function _del(key, options, cb) {
    this._batch([{ type: "del", key: key }], options, cb);
  },

  _batch: function _batch(ops, options, cb) {
    var batch = this._chainedBatch();

    ops.forEach(function (op) {
      try {
        op.type == "del" ? batch._del(op.key, options) : batch._put(op.key, op.value, options);
      } catch (err) {
        cb(err);
      }
    });

    batch._write(cb);
  },

  _iterator: function _iterator(options) {
    var rs = this._createReadStream(options);

    return new _abstractStreamIterator2['default'](rs);
  },

  _chainedBatch: function _chainedBatch() {
    var ws = this._createWriteStream();

    return new _abstractStreamChainedBatch2['default'](ws);
  }
});

module.exports = AbstractStreamLevelDOWN;