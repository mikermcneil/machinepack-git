module.exports = {

  id: 'status',
  moduleName: 'machinepack-git',
  description: 'Get the current "working tree status" of a local git repo.',
  dependencies: {
    git: '*'
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
      example: {}
    }
  },

  fn: function($i, $x, $d) {

    var Github = $d.github;

    var github = new Github({
      version: '3.0.0',
      // optional
      // debug: true,
      // protocol: 'https',
      // host: 'github.my-GHE-enabled-company.com',
      // pathPrefix: '/api/v3', // for some GHEs
      // timeout: 5000
    });

    github.repos.get({
      repo: $i.repo,
      user: $i.user
    }, function(err, data) {
      if (err) return $x(err);
      else return $x.success(data);
    });
  }

};
