'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _abstractLeveldownAbstractChainedBatch = require('abstract-leveldown/abstract-chained-batch');

var _abstractLeveldownAbstractChainedBatch2 = _interopRequireDefault(_abstractLeveldownAbstractChainedBatch);

function AbstractStreamChainedBatch(stream) {
  var _this = this;

  this._stream = stream;
  this._error = null;

  this._stream.on('error', function (err) {
    _this._error = err;
  });
}
(0, _inherits2['default'])(AbstractStreamChainedBatch, _abstractLeveldownAbstractChainedBatch2['default']);
(0, _objectAssign2['default'])(AbstractStreamChainedBatch.prototype, {
  _put: function _put(key, value, options) {
    this._stream.write({ key: key, value: value });
  },

  _del: function _del(key, options) {
    this._put(key, undefined, options);
  },

  _clear: function _clear() {
    throw new Error("Not supported.");
  },

  _write: function _write(cb) {
    var _this2 = this;

    this._stream.end(function () {
      cb(_this2._error);
    });
  }
});

module.exports = AbstractStreamChainedBatch;