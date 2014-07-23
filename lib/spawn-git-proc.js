/**
 * Module dependencies
 */

var GitProcessStreamFactory = require('./spawn-git-procstream');




/**
 * spawn-git-proc
 *
 * @param  {Object}   options
 *                    | - command : 'pull'
 *                    | - dir     : './path/to/a/local/repo/or/soon-to-be/repo'
 * @param  {Function} callback
 */

module.exports = function _spawn_git_proc(options, callback) {

  var process__ = GitProcessStreamFactory(options);

  var output = '';
  var errOutput = '';
  var combinedOutput = '';
  var spinlock;
  process__
  .on('data', function (_outChunk){
    output += _outChunk;
    combinedOutput += _outChunk;
  })
  .on('error', function (_errChunk){
    errOutput += _errChunk;
    combinedOutput += _errChunk;
  })
  .on('end', function (){
    if (spinlock) return;
    spinlock = true;

    if (errOutput) return callback(errOutput);
    return callback(null, combinedOutput);
  });
};

