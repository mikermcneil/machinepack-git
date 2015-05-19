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
        return exits.success();
      }
    });
  }

};
