/**
 * Module dependencies
 */

var Stream = require('stream').Stream;
var spawn = require('child_process').spawn;
var util = require('util');
var _ = require('lodash');


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

  var repoPath = options.dir;
  var command = options.command;

  var stream = new Stream();
  stream.readable = true;
  stream.writable = false;

  // Buffer some output so we can notice data passing through stdout which
  // indicates an error condition which is not appropriately marked with a
  // non-zero exit code.
  var stdoutBuffer = '';
  var stderrBuffer = '';

  // if `command` is a string, wrap it in brackets
  if (typeof command === 'string') {
    command = [command];
  }
  // otherwise it must be an array, so pass it directly in

  // Prune empty items in the command to avoid confusing the
  // child process spawn method:
  _.remove(command, function (piece, i) {
    return !piece;
  });

  // Build a human-readable version of the command for use in log/error output
  var humanReadableCommand = command.join(' ');

  // Spawn a process
  var spinlock;
  console.log('in %s, running cmd: ',repoPath,command);
  var ps = spawn('git', command, { cwd: repoPath||process.cwd() });
  ps.on('exit', function (code) {

    var err;

    // Correct any confusing exit codes from git
    // by buffering/watching stdout and creating an
    // `err` object if something looks amiss.
    //
    // For example, see:
    // http://git.661346.n2.nabble.com/git-push-output-goes-into-stderr-td6758028.html
    // if ( !!
    //   stdoutBuffer.match(/TBD/i)
    // ) {
    //   err = new Error();
    //   err.code = 'E_NOT_STAGED_FOR_COMMIT';
    // }

    // Emit an error for all non-zero error codes
    if (!!code) {
      err = new Error();
      err.message = util.format('An error occurred spawning `git %s`:\n\nstdout:\n%s\n\nstderr:\n%s\n\nPlease review the docs for the machine you\'re using\n(and check that the usage displayed above looks correct)', humanReadableCommand, stdoutBuffer, stderrBuffer);
      err.command = util.format('git %s', humanReadableCommand);
      err.stdout = stdoutBuffer;
      err.stderr = stderrBuffer;
      err.code = 'E_GIT';
      err.status = code;
    }

    if (err) {
      stream.emit('error', err);
    }
    ps.kill();
  });

  ps.on('error', function (err) {
    stream.emit('error', err);
  });
  ps.on('close', function () {
    if (spinlock) return;
    spinlock = true;

    stream.emit('end');
  });

  // Listen on stdout
  ps.stdout.on('data', function (data) {
    stdoutBuffer += data;
    stream.emit('data', data);
  });

  // Listen on stderr
  ps.stderr.on('data', function (data) {
    stderrBuffer += data;
    stream.emit('data', data);

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // This is a change from the original version of this code--
    // apparently in git, data coming in on `stderr` doesn't necessarily
    // mean there was any sort of problem.
    // (e.g. see http://git.661346.n2.nabble.com/git-push-output-goes-into-stderr-td6758028.html)
    //
    // stream.emit('error', data);
    ////////////////////////////////////////////////////////////////////////////////////////////////
  });

  return stream;
};
