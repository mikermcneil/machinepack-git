/**
 * Module dependencies
 */

var git = require('./lib/spawn-git-proc');
var fsx = require('fs-extra');


module.exports = {

  id: 'pull',
  moduleName: 'machinepack-git',
  description: 'Fetch from and integrate with another git repository or a local branch',
  transparent: true,

  inputs: {
    dir: {
      example: './'
    },
    remote: {
      example: 'origin'
    },
    branch: {
      example: 'master'
    }
  },

  exits: {
    error: {
      example: 'fatal: No remote repository specified.  Please, specify either a URL or a\nremote name from which new revisions should be fetched.\nError: An error occurred spawning `git pull`'
    },
    success: {
      example: 'Already up-to-date.'
    }
  },

  fn: function($i, $x) {

    fsx.ensureDir($i.dir, function(err) {
      if (err) return $x.error(err);

      git({
        dir: $i.dir,
        command: ['pull', $i.remote||'origin', $i.branch||'master']
      }, $x);
    });

  }

};
