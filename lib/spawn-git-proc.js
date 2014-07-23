/**
 * Module dependencies
 */

var GitProcessStreamFactory = require('./spawn-git-procstream');




/**
 * spawn-git-proc
 *
 * @param  {Object}   options
 *                    | - command : 'pull'
 *                    | - repo    : './path/to/a/repo'
 * @param  {Function} callback
 */

module.exports = function _spawn_git_proc(options, callback) {

  var process__ = GitProcessStreamFactory(options);

  var spinlock;
  var output = '';
  process__
  .on('data', function (data){
    output += data;
  })
  .on('error', function (err){
    if (spinlock) return;
    spinlock = true;
    return callback(err);
  })
  .on('end', function (){
    if (spinlock) return;
    spinlock = true;
    return callback(null, output);
  });
};

