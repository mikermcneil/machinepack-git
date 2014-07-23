// From https://github.com/michaelnisi/gitpull

var Stream = require('stream').Stream
  , spawn = require('child_process').spawn

module.exports = function (path, callback) {
  var ps = spawn('git', ['pull'], { cwd: path })
    , stream = new Stream()
    , err

  stream.readable = true
  stream.writable = false

  function handleError(message) {
    err = new Error(message)
    stream.emit('error', err)
  }

  ps.on('exit', function (code) {
    if (!!code) {
      handleError(code)
    }

    ps.kill()
  })

  ps.on('close', function () {
    stream.emit('end')
    if (callback) {
      callback(err)
    }
  })

  ps.stdout.on('data', function (data) {
    stream.emit('data', data)
  })

  ps.stderr.on('data', handleError)

  return stream
}
