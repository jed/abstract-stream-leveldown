abstract-stream-leveldown
=========================

This library provides a smaller API footprint for using [AbstractLevelDOWN][] to create [LevelDOWN][] stores, by implementing a [Readable][] and [Writable][] stream instead of all of the [abstract LevelDOWN methods][].

Example
-------

```javascript
import {AbstractStreamLevelDOWN} from "abstract-stream-leveldown"

class MyLevelDOWN extends AbstractStreamLevelDOWN {
  _createReadStream(options) {}
  _createWriteStream(options) {}
}
```

[AbstractLevelDOWN]: https://github.com/rvagg/abstract-leveldown
[LevelDOWN]: https://github.com/rvagg/node-leveldown
[Readable]: https://iojs.org/api/stream.html#stream_class_stream_readable
[Writable]: https://iojs.org/api/stream.html#stream_class_stream_writable
[abstract LevelDOWN methods]: https://github.com/rvagg/abstract-leveldown#extensible-api
