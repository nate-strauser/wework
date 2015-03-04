Migrations.add({
  version: 1,
  name: 'Adds emailHash for all existing users',
  up: function() {
    Users.find({}).forEach(function(user) {
      var email = getUserEmail(user);
      if (email)
        Users.update({
          _id: user._id
        }, {
          $set: {
            emailHash: CryptoJS.MD5(email.trim().toLowerCase()).toString()
          }
        });
    });
  },
  down: function() {}
});

Migrations.add({
  version: 2,
  name: 'Adds isDeveloper for all existing users',
  up: function() {
    var profileUserIds = _.pluck(Profiles.find().fetch(), 'userId');
    Users.update({
      _id: {
        $in: profileUserIds
      }
    }, {
      $set: {
        isDeveloper: true
      }
    }, {
      multi: true
    });
    Users.update({
      _id: {
        $nin: profileUserIds
      }
    }, {
      $set: {
        isDeveloper: false
      }
    }, {
      multi: true
    });
  },
  down: function() {}
});

Migrations.add({
  version: 3,
  name: 'Adds randomSorter for all developers',
  up: function() {
    Profiles.find({}).forEach(function(profile) {
      Profiles.update({
        _id: profile._id
      }, {
        $set: {
          randomSorter: Math.floor(Math.random() * 10000)
        }
      });
    });
  },
  down: function() {}
});

Migrations.add({
  version: 4,
  name: 'Copy htmlDescription over to description',
  up: function() {
    Profiles.find({}).forEach(function(profile) {
      if(profile.htmlDescription)
        Profiles.update({
          _id: profile._id
        }, {
          $set: {
            description: profile.htmlDescription,
            htmlDescription: cleanHtml(profile.htmlDescription)
          }
        });
    });

    Jobs.find({}).forEach(function(job) {
      if(job.htmlDescription)
        Jobs.update({
          _id: job._id
        }, {
          $set: {
            description: job.htmlDescription,
            htmlDescription: cleanHtml(job.htmlDescription)
          }
        });
    });

  },
  down: function() {}
});

Migrations.add({
  version: 5,
  name: 'Set status for all profiles/jobs',
  up: function() {
    Profiles.update({},{$set:{status:"active"}}, {multi:true});
    Jobs.update({},{$set:{status:"active"}}, {multi:true});
  },
  down: function() {}
});

Migrations.migrateTo('latest');
