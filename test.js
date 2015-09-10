import { AbstractStreamLevelDOWN } from './'

class MyLevelDOWN extends AbstractStreamLevelDOWN {
   _createReadStream([options]) { /* return a Readable */ }
   _createWriteStream([options]) { /* return a Writable */ }
}
