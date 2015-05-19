module.exports = {

  friendlyName: 'Pull',


  description: 'Fetch from and integrate with a git repository or a local branch',


  cacheable: true,


  inputs: {

    destination: {
      description: 'The path where the working copy exists locally (where the remote repo should be pulled)',
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

    success: {
      example: 'Already up-to-date.'
    }

  },

  fn: function(inputs, exits) {

    var Proc = require('machinepack-process');

    Proc.spawn({
      command: 'git pull ' + inputs.remote + ' ' + inputs.branch,
      dir: inputs.destination
    }, {
      error: function (err) {
        try {
          console.log(err, Object.keys(err), err.signal, err.killed, err.code);
          if (err.message.match(/Not a git repository/)) {
            return exits.notRepo();
          }
          if (err.message.match(/Your local changes to the following files would be overwritten by merge/) || err.message.match(/Please, commit your changes or stash them before you can merge/)) {
            return exits.uncommittedChanges();
            // TODO: attempt to parse out a list of the files which would be overwritten by merge
            /*
            Error: Command failed: From github.com:mikermcneil/machinepack-git
             * branch            master     -> FETCH_HEAD
               874fab0..afa9e77  master     -> origin/master
            error: Your local changes to the following files would be overwritten by merge:
              README.md
            Please, commit your changes or stash them before you can merge.
            Aborting

                at ChildProcess.exithandler (child_process.js:637:15)
                at ChildProcess.EventEmitter.emit (events.js:98:17)
                at maybeClose (child_process.js:743:16)
                at Socket.<anonymous> (child_process.js:956:11)
                at Socket.EventEmitter.emit (events.js:95:17)
                at Pipe.close (net.js:465:12)
             */
          }

          if (err.message.match(/Pull is not possible because you have unmerged files/i)) {
            return exits.unresolvedConflicts();
             /*
             Error: Command failed: Pull is not possible because you have unmerged files.
              Please, fix them up in the work tree, and then use 'git add/rm <file>'
              as appropriate to mark resolution, or use 'git commit -a'.

                  at ChildProcess.exithandler (child_process.js:637:15)
                  at ChildProcess.EventEmitter.emit (events.js:98:17)
                  at maybeClose (child_process.js:743:16)
                  at Socket.<anonymous> (child_process.js:956:11)
                  at Socket.EventEmitter.emit (events.js:95:17)
                  at Pipe.close (net.js:465:12)
              */
          }


           /*
           Error: Command failed: From github.com:mikermcneil/machinepack-git
             * branch            master     -> FETCH_HEAD

                at ChildProcess.exithandler (child_process.js:637:15)
                at ChildProcess.EventEmitter.emit (events.js:98:17)
                at maybeClose (child_process.js:743:16)
                at Process.ChildProcess._handle.onexit (child_process.js:810:5)
            */
           // ========== ==================== ========== and then ========== ==================== ==========
        }
        catch (e){}
        return exits.error(err);
      },
      forbidden: exits.forbidden,
      noSuchDir: exits.noSuchDir,
      success: function (outs) {
        console.log(outs);
        //{
        //  stdout: 'Already up-to-date.\n',
        //  stderr: 'From github.com:mikermcneil/scribe\n * branch            master     -> FETCH_HEAD\n'
        //}


        /*
        {
          stdout: 'Updating 3d37349..d513869\nFast-forward\n api/controllers/StaticController.js                | 82 ++++++++++++++++++++++\n assets/js/cloud/misc.endpoints.js....                              |  6 +-\n 23 files changed, 340 insertions(+), 32 deletions(-)\n create mode 100644 assets/templates/shared-elements/modals/name-grouped-thing.html\n',
          stderr: 'From github.com:someapp/someapp-july\n * branch            master     -> FETCH_HEAD\n   3d37349..d513869  master     -> origin/master\n' }
         */
        return exits.success();
      }
    });

  }

};
