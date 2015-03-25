abstract-stream-leveldown
=========================

STATUS: THOUGHT EXPERIMENT

This library provides a smaller API footprint for using [AbstractLevelDOWN][] to create a [LevelDOWN][] backend, by implementing a [Readable][] and [Writable][] stream instead of all of the [abstract LevelDOWN methods][].

Example
-------

```javascript
import {AbstractStreamLevelDOWN} from "abstract-stream-leveldown"

class MyLevelDOWN extends AbstractStreamLevelDOWN {
  _createReadStream(options) { /* return a Readable */ }
  _createWriteStream(options) { /* return a Writable */ }
}
```

API
---

### AbstractStreamLevelDOWN#_createReadStream([options])

Returns a [Readable][] stream. `options` should support the same properties as those to be passed to [createReadStream][].

### AbstractStreamLevelDOWN#_createWrite(options)

Returns a [Writable][] stream. `options` should support the same properties as those to be passed to [put][].

[AbstractLevelDOWN]: https://github.com/rvagg/abstract-leveldown
[LevelDOWN]: https://github.com/rvagg/node-leveldown
[Readable]: https://iojs.org/api/stream.html#stream_class_stream_readable
[Writable]: https://iojs.org/api/stream.html#stream_class_stream_writable
[abstract LevelDOWN methods]: https://github.com/rvagg/abstract-leveldown#extensible-api
[createReadStream]: https://github.com/rvagg/node-levelup#createReadStream
[put]: https://github.com/rvagg/node-levelup#put
