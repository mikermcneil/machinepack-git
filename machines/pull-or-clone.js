module.exports = {

  identity: 'pull-or-clone',
  friendlyName: 'Pull or clone',
  description: 'Clone a git repo to a folder on disk (or if the folder already exists, just pull)',
  cacheable: true,

  inputs: {
    dir: {
      description: 'Path (relative or absolute) to the directory where the repo should be cloned.  Will be created if necessary.',
      example: './',
      required: true
    },
    remote: {
      description: 'Remote Git repo URL to clone.',
      example: 'git://github.com/balderdashy/sails-docs.git',
      required: true
    },
    branch: {
      description: 'Branch of the repo to clone.  Defaults to "master".',
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

  fn: function (inputs, exits) {

    var Machine = require('node-machine');

    Machine.build(require('./status'))
    .configure({
      dir: inputs.dir
    })
    .exec({
      error: function (errStatus) {
        Machine.build(require('./clone'))
        .configure({
          dir: inputs.dir,
          remote: inputs.remote
        })
        .exec(exits);
      },
      success: function (status){
        Machine.build(require('./pull'))
        .configure({
          dir: inputs.dir,
          remote: inputs.remote,
          branch: inputs.branch || 'master'
        })
        .exec(exits);
      }
    });
  }
};
