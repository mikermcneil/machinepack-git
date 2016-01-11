module.exports = {

  friendlyName: 'Clone',


  description: 'Clone a remote git repository into a new local directory.',


  cacheable: true,


  inputs: {

    destination: {
      friendlyName: 'Destination',
      description: 'Path (relative or absolute) to the directory where the repo should be cloned.  Will be created if necessary.',
      example: './put/the/new/local/repo/here',
      required: true
    },

    remote: {
      friendlyName: 'Remote (URL)',
      description: 'The URL of the git remote repository that will be cloned.',
      example: 'git://github.com/balderdashy/sails-docs.git',
      required: true
    },

    branch: {
      description: 'The remote branch to check out after pulling (if omitted, do not check out anything-- just use whatever the default is)',
      example: 'master'
    }

  },


  exits: {

    forbidden: {
      description: 'Insufficient permissions at destination path to clone repo repo.'
    },

    alreadyExists: {
      description: 'Somthing other than an empty directory already exists at the destination path.'
    },

    success: {
      description: 'Done.'
    }

  },


  fn: function(inputs, exits) {

    var Proc = require('machinepack-process');

    // Ensure destination is an absolute path.
    inputs.destination = require('path').resolve(inputs.destination);

    Proc.spawn({
      command: 'git clone ' + inputs.remote + ' ' + inputs.destination
    }, {
      error: function (err) {
        // always seems to be `killed: false`, `code: 128`, `signal: null`
        try {
          if (err.message.match(/Permission denied/)) {
            return exits.forbidden(err);
          }
          if (err.message.match(/already exists and is not an empty directory/)) {
            return exits.alreadyExists(err);
          }
        }
        catch (e){}
        return exits.error(err);
      },
      success: function (outs) {

        // If a specific branch was not specified, then we're done.
        if (!inputs.branch) {
          return exits.success();
        }

        // But if it was, then we need to check out that branch.
        Proc.spawn({
          command: 'git checkout '+inputs.branch,
          dir: inputs.destination
        }).exec({
          error: function (err) {
            return exits.error(err);
          },
          success: function () {
            return exits.success();
          }
        });

      }
    });
  }

};
