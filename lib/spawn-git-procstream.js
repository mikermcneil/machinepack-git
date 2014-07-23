/**
 * Module dependencies
 */

var Stream = require('stream').Stream;
var spawn = require('child_process').spawn;
var util = require('util');



/**
 * spawn-git-procstream
 *
 * Inspired by / extended from:
 * @michaelnisi's git-pull module (https://github.com/michaelnisi/gitpull)
 *
 * @param  {Object}   options
 *                    | - command : 'pull'
 *                    | - repo    : './path/to/a/repo'
 * @return {Stream}
 */

module.exports = function _spawn_git_procstream (options) {

  var repoPath = options.repo;
  var command = options.command;

  var stream = new Stream();
  stream.readable = true;
  stream.writable = false;


  // Buffer some output so we can notice data passing through stdout which
  // indicates an error condition which is not appropriately marked with a
  // non-zero exit code.
  var outputMonitorBuffer = '';

  function handleError(err) {
    stream.emit('error', err);
  }

  // Spawn a process
  var ps = spawn('git', [command], { cwd: repoPath });
  ps.on('exit', function (code) {

    var err;

    // // Correct any confusing exit codes from git
    // // by buffering/watching stdout and creating an
    // // `err` object if something looks amiss.
    // if ( !!
    //   outputMonitorBuffer.match(/TBD/i)
    // ) {
    //   err = new Error();
    //   err.code = 'E_NOT_STAGED_FOR_COMMIT';
    // }

    // Emit an error for all non-zero error codes
    if (!!code) {
      err = new Error();
      err.message = util.format('An error occurred spawning `git %s`', command);
      err.command = util.format('git %s', command);
      err.code = 'E_GIT';
      err.status = code;
    }

    if (err) {
      handleError(err);
    }
    ps.kill();
  });
  ps.on('close', function () {
    stream.emit('end');
  });

  // Listen on stdout
  ps.stdout.on('data', function (data) {
    outputMonitorBuffer += data;
    stream.emit('data', data);
  });

  // Listen on stderr
  ps.stderr.on('data', function (data) {
    handleError(data);
  });

  return stream;
};
