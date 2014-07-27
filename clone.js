/**
 * Module dependencies
 */

var git = require('./lib/spawn-git-proc');


module.exports = {

  id: 'clone',
  moduleName: 'machinepack-git',
  description: 'Clone a remote git repository into a new local directory.',
  transparent: true,

  inputs: {
    dir: {
      example: './put/the/new/local/repo/here'
    },
    remote: {
      example: 'git://github.com/balderdashy/sails-docs.git'
    }
  },

  exits: {
    error: {
      example: {
        code: 'E_GIT',
        message: 'An error occurred spawning `git clone`:\nstdout:\n\nstderr:\n\n\nPlease review the docs for the machine you\'re using\n(and check that the usage displayed above looks correct)'
      }
    },
    success: {
      example: 'Cloning into \'./put/the/new/local/repo/here\'...'
    }
  },

  fn: function($i, $x) {
    git({
      command: ['clone', $i.remote, $i.dir]
    }, $x);
  }

};
