/**
 * Module dependencies
 */

var git = require('./lib/spawn-git-proc');


module.exports = {

  id: 'status',
  moduleName: 'machinepack-git',
  description: 'Get the current "working tree status" of a local git repo.',
  transparent: true,
  inputs: {
    dir: {
      example: './'
    }
  },
  exits: {
    error: {
      example: {}
    },
    success: {
      example: 'On branch master\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git checkout -- <file>..." to discard changes in working directory)\n\n\tmodified:   status.js\n\nno changes added to commit (use "git add" and/or "git commit -a")\n'
    }
  },
  fn: function($i, $x, $d) {
    git({
      dir: $i.dir,
      command: 'status'
    }, $x);
  }

};
