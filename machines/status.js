module.exports = {


  friendlyName: 'Status',


  description: 'Get the current "working tree status" of a local git repo.',


  cacheable: true,


  inputs: {

    dir: {
      description: 'Path (relative or absolute) to the working copy to get the status of.',
      example: './',
      required: true
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

    success: {
      variableName: 'statusMsg',
      description: 'Returns the output of `git status`',
      example: 'On branch master\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git checkout -- <file>..." to discard changes in working directory)\n\n\tmodified:   status.js\n\nno changes added to commit (use "git add" and/or "git commit -a")\n'
    }

  },


  fn: function(inputs, exits) {

    var Proc = require('machinepack-process');

    Proc.spawn({
      command: 'git status',
      dir: inputs.dir
    }, {
      error: function (err) {
        // console.log(err.killed, err.code, err.sigal);
        // always seems to be `killed: false`, `code: 128`, `signal: null` (or undefined)
        try {
          if (err.message.match(/Not a git repository/)) {
            return exits.notRepo();
          }
        }
        catch (e){}
        return exits.error(err);
      },
      forbidden: exits.forbidden,
      noSuchDir: exits.noSuchDir,
      success: function (outs) {
        // outs.stdout =>
        //  • 'On branch master\nYour branch is up-to-date with \'origin/master\'.\n\nnothing to commit, working directory clean\n'
        //    -or-
        //  • 'On branch master\nYour branch is up-to-date with \'origin/master\'.\n\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git checkout -- <file>..." to discard changes in working directory)\n\n\tmodified:   machines/clone.js\n\tmodified:   machines/pull-or-clone.js\n\tmodified:   machines/pull.js\n\tmodified:   machines/status.js\n\tmodified:   package.json\n\nno changes added to commit (use "git add" and/or "git commit -a")\n',
        return exits.success(outs.stdout);
      }
    });
  }

};
