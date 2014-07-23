
// Usage Example:
// ----------------------------
// require('node-machine')
// .require('./pull')
// .configure({
//   repo: './'
// }).exec(function(e, o) {
//   console.log('E:', e);
//   console.log('O:', o);
// })


module.exports = {

  id: 'pull',
  moduleName: 'machinepack-git',
  description: 'Fetch from and integrate with another git repository or a local branch',
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
      example: 'fatal: No remote repository specified.  Please, specify either a URL or a\nremote name from which new revisions should be fetched.\nError: An error occurred spawning `git pull`'
    },
    success: {
      example: ''
    }
  },

  fn: function($i, $x, $d) {

    var git = $d['./lib/spawn-git-proc'];

    git({
      repo: $i.repo,
      command: 'pull'
    }, $x);
  }

};
