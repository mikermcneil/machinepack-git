
// Usage Example:
// ----------------------------
// require('node-machine')
// .require('./status')
// .configure({
//   command: 'pull',
//   repo: './'
// }).exec(function(e, o) {
//   console.log('E:', e);
//   console.log('O:', o);
// })


module.exports = {

  id: 'status',
  moduleName: 'machinepack-git',
  description: 'Get the current "working tree status" of a local git repo.',
  dependencies: {
    './lib/spawn-git-proc': '*'
  },
  transparent: true,

  inputs: {
    repo: {
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

    var git = $d['./lib/spawn-git-proc'];

    git({
      repo: $i.repo,
      command: $i.command
    }, function(err, workingTreeStatus) {
      if (err) return $x(err);
      else return $x.success(workingTreeStatus);
    });
  }

};
