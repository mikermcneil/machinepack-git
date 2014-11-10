module.exports = {

  identity: 'clone',
  friendlyName: 'clone',
  description: 'Clone a remote git repository into a new local directory.',
  cacheable: true,

  inputs: {
    dir: {
      example: './put/the/new/local/repo/here',
      required: true
    },
    remote: {
      example: 'git://github.com/balderdashy/sails-docs.git',
      required: true
    }
  },

  defaultExit: 'success',
  catchallExit: 'error',

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

  fn: function(inputs, exits) {

    var git = require('../lib/spawn-git-proc');

    git({
      command: ['clone', inputs.remote, inputs.dir]
    }, exits);
  }

};
