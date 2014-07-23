
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
    './lib/spawn-git-proc': '*',
    'fs-extra': '*'
  },
  transparent: true,

  inputs: {
    dir: {
      example: './'
    },
    remote: {
      example: 'origin'
    },
    branch: {
      example: 'master'
    }
  },

  exits: {
    error: {
      example: 'fatal: No remote repository specified.  Please, specify either a URL or a\nremote name from which new revisions should be fetched.\nError: An error occurred spawning `git pull`'
    },
    success: {
      example: 'Already up-to-date.'
    }
  },

  fn: function($i, $x, $d) {

    var fsx = $d['fs-extra'];
    var git = $d['./lib/spawn-git-proc'];

    fsx.ensureDir($i.dir, function(err) {
      if (err) return $x.error(err);

      git({
        dir: $i.dir,
        command: ['pull', $i.remote||'origin', $i.branch||'master']
      }, $x);
    });

  }

};
