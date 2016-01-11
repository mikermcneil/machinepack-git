module.exports = {

  friendlyName: 'Pull or clone',


  description: 'Clone a git repo to a folder on disk (or if the folder already exists, just pull)',


  cacheable: true,


  inputs: {

    destination: {
      description: 'The path where the remote repo should be pulled (will be created if necessary)',
      example: './',
      required: true
    },

    remote: {
      description: 'The git remote to pull from (defaults to "origin", but you can specify a named remote or URL)',
      example: 'origin',
      defaultsTo: 'origin'
    },

    branch: {
      description: 'The remote branch to pull (defaults to "master")',
      example: 'master',
      defaultsTo: 'master'
    }

  },


  exits: {

    notRepo: {
      description: 'Specified directory is not a git repository (and neither are any of its parents)'
    },

    forbidden: {
      description: 'Insufficient permissions (i.e. you might need to use `chown`/`chmod`)'
    },

    noSuchDir: {
      description: 'Specified directory does not exist.'
    },

    uncommittedChanges: {
      description: 'Cannot pull because uncommitted/unstashed local changes exist locally and would be overwritten by merge.'
    },

    unresolvedConflicts: {
      description: 'Cannot pull because this local repo has unmerged conflicts.',
      extendedDescription: 'To get past this, one would need to resolve the merge conflicts manually, commit the changes (`git commit -am "..your msg.."`), then run this machine again.'
    },

    failed: {
      description: 'The command failed-- the local repo may now be in an invalid/unmerged state. Please verify that this is not the case.',
      extendedDescription: 'If this exit is traversed, it means the child process running `git pull` failed with an exit code of 1, and the output didn\'t match any of our other heuristics for detecing errors.'
    },

    success: {
      description: 'Done.'
    }

  },


  fn: function (inputs, exits) {

    var thisPack = require('../');

    thisPack.status({
      dir: inputs.destination
    }).exec({
      error: exits.error,
      noSuchDir: function () {
        thisPack.clone({
          destination: inputs.destination,
          remote: inputs.remote,
          branch: inputs.branch
        }).exec(exits);
      }, //</status.noSuchDir>
      success: function (status){
        thisPack.pull({
          destination: inputs.destination,
          remote: inputs.remote,
          branch: inputs.branch
        }).exec(exits);
      } //</status.success>
    }); // </status>
  }

};
