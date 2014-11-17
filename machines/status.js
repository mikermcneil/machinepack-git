module.exports = {

  identity: 'status',
  friendlyName: 'status',
  description: 'Get the current "working tree status" of a local git repo.',
  cacheable: true,

  inputs: {
    dir: {
      description: 'Path (relative or absolute) to the working copy to get the status of.',
      example: './',
      required: true
    }
  },

  defaultExit: 'success',
  catchallExit: 'error',

  exits: {
    error: {
      example: {}
    },
    success: {
      example: 'On branch master\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git checkout -- <file>..." to discard changes in working directory)\n\n\tmodified:   status.js\n\nno changes added to commit (use "git add" and/or "git commit -a")\n'
    }
  },

  fn: function(inputs, exits) {

    var git = require('../lib/spawn-git-proc');

    git({
      dir: inputs.dir,
      command: 'status'
    }, exits);
  }

};
