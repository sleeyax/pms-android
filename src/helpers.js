const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
const appendFileAsyncPromise = promisify(fs.appendFile)

module.exports = {
  writeToLog: (msg, logDir, isError = false) => {
    const date = new Date()
    const timestamp = date.toTimeString().split(' ')
    const dateTimeStamp = `${date.toDateString()} ${timestamp}`
    return appendFileAsyncPromise(path.join(logDir, 'log.txt'), `[${dateTimeStamp}] ${isError ? 'error' : 'info'}: ${msg}\n`);
  }
};