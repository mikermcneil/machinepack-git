module.exports = {

  identity: 'pull',
  friendlyName: 'pull',
  description: 'Fetch from and integrate with another git repository or a local branch',
  cacheable: true,

  inputs: {
    dir: {
      description: 'Path (relative or absolute) to the working copy that the remote repo should be pulled into.',
      example: './',
      required: true
    },
    remote: {
      description: 'Remote Git reference.',
      example: 'origin'
    },
    branch: {
      description: 'Remote Git branch.',
      example: 'master'
    }
  },

  defaultExit: 'success',
  catchallExit: 'error',

  exits: {
    error: {
      example: 'fatal: No remote repository specified.  Please, specify either a URL or a\nremote name from which new revisions should be fetched.\nError: An error occurred spawning `git pull`'
    },
    success: {
      example: 'Already up-to-date.'
    }
  },

  fn: function(inputs, exits) {

    var git = require('../lib/spawn-git-proc');
    var fsx = require('fs-extra');

    fsx.ensureDir(inputs.dir, function(err) {
      if (err) return exits.error(err);

      var remote = inputs.remote || 'origin';
      var branch = inputs.branch || 'master';

      git({
        dir: inputs.dir,
        command: ['pull', remote, branch]
      }, exits);
    });

  }

};
