/**
 * Module dependencies
 */

var Machine = require('node-machine');


module.exports = {
  id: 'pull-or-clone',
  moduleName: 'machinepack-git',
  description: 'Clone a git repo to a folder on disk (or if the folder already exists, just pull)',
  inputs: {
    dir: {
      example: './'
    },
    remote: {
      example: 'git://github.com/balderdashy/sails-docs.git'
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

  fn: function ($i,$x) {
    Machine.require('./pull')
    .configure($i)
    .exec({
      error: function (err) {
        Machine.require('./clone')
        .configure($i)
        .exec($x);
      },
      success: $x.success
    });
  }
};
