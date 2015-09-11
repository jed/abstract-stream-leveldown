'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _abstractLeveldownAbstractIterator = require('abstract-leveldown/abstract-iterator');

var _abstractLeveldownAbstractIterator2 = _interopRequireDefault(_abstractLeveldownAbstractIterator);

function AbstractStreamIterator(stream) {
  var _this = this;

  this._stream = stream;
  this._hasEnded = false;
  this._error = null;

  this._stream.on('end', function () {
    _this._hasEnded = true;
    _this._check();
  });

  this._stream.on('error', function () {
    _this._error = err;
    _this._check();
  });
}
(0, _inherits2['default'])(AbstractStreamIterator, _abstractLeveldownAbstractIterator2['default']);
(0, _objectAssign2['default'])(AbstractStreamIterator.prototype, {
  _next: function _next(cb) {
    this._cb = cb;
    this._check();
  },

  _check: function _check() {
    var _this2 = this;

    if (this._error) return setImmediate(this._cb, this._error);

    var kv = this._stream.read();

    if (kv !== null) return setImmediate(this._cb, null, kv.key, kv.value);

    if (this._hasEnded) return setImmediate(this._cb);

    this._stream.once('readable', function () {
      _this2._check();
    });
  }
});

module.exports = AbstractStreamIterator;