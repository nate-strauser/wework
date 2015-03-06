Meteor.publish("userData", function() {
  check(arguments, [Match.Any]);
  if (this.userId) {
    return [
      Users.find({
        _id: this.userId
      }),
      Profiles.find({
        userId: this.userId
      })
    ];
  }
  this.ready();
});

Meteor.publish('jobCount', function() {
  Counts.publish(this, 'jobs', Jobs.find({
    createdAt: {
      $gte: daysUntilExpiration()
    },
    status: "active"
  }));
});

Meteor.publish('developerCount', function() {
  Counts.publish(this, 'developers', Profiles.find({
    status: "active"
  }));
});

Meteor.publish("homeJobs", function() {
  check(arguments, [Match.Any]);
  return [
    Jobs.find({
      createdAt: {
        $gte: daysUntilExpiration()
      },
      status: "active"
    }, {
      sort: {
        createdAt: -1
      },
      limit: 10,
      fields: {
        title: true,
        company: true,
        location: true,
        createdAt: true,
        updatedAt: true,
        remote: true,
        jobtype: true,
        status:true
      }
    })
  ];
});

Meteor.publishComposite('homeDevelopers', {
  find: function() {
    return Profiles.find({
    	status: "active"
    }, {
      sort: {
        availableForHire: -1,
        randomSorter: 1
      },
      limit: 8,
      fields: {
        userId: true,
        title: true,
        location: true,
        availableForHire: true,
        randomSorter: true,
        type: true,
        name: true,
        status:true,
        customImageUrl:true
      }
    });
  },
  children: [{
    find: function(profile) {
      return Users.find({
        _id: profile.userId
      }, {
        fields: {
          "emailHash": true,
          "services.facebook.id": true,
          "services.twitter.profile_image_url": true,
          "services.facebook.id": true,
          "services.google.picture": true,
          "services.github.username": true
        }
      });
    }
  }]
});

Meteor.publish("jobs", function() {
  check(arguments, [Match.Any]);
  return [
    Jobs.find({
      createdAt: {
        $gte: daysUntilExpiration()
      },
      status: "active"
    }, {
      fields: {
        title: true,
        company: true,
        location: true,
        createdAt: true,
        updatedAt: true,
        remote: true,
        jobtype: true,
        status:true
      }
    })
  ];
});

Meteor.publish("my_jobs", function() {
  check(arguments, [Match.Any]);
  if (this.userId) {
    return [
      Jobs.find({
        userId: this.userId
      })
    ];
  }
  this.ready();
});

Meteor.publish("job", function(jobId) {
  check(arguments, [Match.Any]);
  return [
    Jobs.find({
      _id: jobId
    })
  ];
});

Meteor.publishComposite('profile', function(profileId) {
  return {
    find: function() {
      return Profiles.find({
        _id: profileId
      })
    },
    children: [{
      find: function(profile) {
        return Users.find({
          _id: profile.userId
        }, {
          fields: {
            "emailHash": true,
            "services.facebook.id": true,
            "services.twitter.profile_image_url": true,
            "services.facebook.id": true,
            "services.google.picture": true,
            "services.github.username": true
          }
        });
      }
    }]
  }
});

Meteor.publish("profiles", function() {
  check(arguments, [Match.Any]);
  return [
    Profiles.find({
    	status: "active"
    }, {
      fields: {
        userId: true,
        title: true,
        location: true,
        availableForHire: true,
        randomSorter: true,
        type: true,
        name: true,
        status:true,
        customImageUrl:true
      }
    }),
    Users.find({  //this may publish users for not active status profiles - could be resolved with publish composite, but performance is slow with so many children lookups
      isDeveloper: true
    }, {
      fields: {
        "emailHash": true,
        "services.facebook.id": true,
        "services.twitter.profile_image_url": true,
        "services.facebook.id": true,
        "services.google.picture": true,
        "services.github.username": true
      }
    })
  ];
});
