const fs = require('fs');
const rootDir = require('../PimpMyStremio/src/lib/dirs/rootDir');
const path = require('path');
const {promisify} = require('util');
const appendFileAsyncPromise = promisify(fs.appendFile);

module.exports = {
  writeToLog: (msg, isError = false) => {
    // TODO: figure out if this is the right location
    return appendFileAsyncPromise(path.join(rootDir, 'log.txt'), `[${new Date().getTime()}] ${isError ? 'error' : 'info'}: ${msg}`);
  }
};