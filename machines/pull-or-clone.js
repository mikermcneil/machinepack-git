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

  },


  fn: function (inputs, exits) {

    var Machine = require('machine');

    Machine.build(require('./status'))
    .configure({
      dir: inputs.dir
    })
    .exec({
      error: function (errStatus) {
        Machine.build(require('./clone'))
        .configure({
          destination: inputs.destination,
          remote: inputs.remote
        })
        .exec(exits);
      },
      success: function (status){
        Machine.build(require('./pull'))
        .configure({
          destination: inputs.destination,
          remote: inputs.remote,
          branch: inputs.branch || 'master'
        })
        .exec(exits);
      }
    });
  }
};
