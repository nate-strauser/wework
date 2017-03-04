//publish name is null to automatically publish to all users
Meteor.publish(null, function () {
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

//define counters outside of publish so there is only 1 per server
var jobCounter = new Counter('jobCount', Jobs.find({
  createdAt: {
    $gte: daysUntilExpiration()
  },
  status: "active"
}));

var developerCounter = new Counter('developerCount', Profiles.find({
  status: "active"
}));

Meteor.publish('jobCount', function () {
  return jobCounter;
});

Meteor.publish('developerCount', function () {
  return developerCounter
});


Meteor.publish("homeJobs", function () {
  check(arguments, [Match.Any]);
  return [
    Jobs.find({
      featuredThrough: {
        $exists: false
      },
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
        status: true,
        featuredThrough: true
      }
    })
  ];
});

Meteor.publish("featuredJobs", function () {
  check(arguments, [Match.Any]);
  return [
    Jobs.find({
      featuredThrough: {
        $gte: new Date()
      },
      status: "active"
    }, {
      sort: {
        featuredThrough: -1
      },
      fields: {
        title: true,
        company: true,
        location: true,
        createdAt: true,
        updatedAt: true,
        remote: true,
        jobtype: true,
        status: true,
        featuredThrough: true
      }
    })
  ];
});

Meteor.publishComposite('homeDevelopers', {
  find: function () {
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
        userName: true,
        status: true,
        customImageUrl: true
      }
    });
  },
  children: [{
    find: function (profile) {
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

Meteor.publish("jobs", function (limit) {
  check(limit, Number);

  return Jobs.find({
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
      status: true,
      featuredThrough: true
    },
    sort: {
      featuredThrough: -1,
      createdAt: -1
    },
    limit: limit
  });
});

Meteor.publish("my_jobs", function () {
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

Meteor.publish("job", function (jobId) {
  check(arguments, [Match.Any]);
  return [
    Jobs.find({
      _id: jobId
    })
  ];
});

Meteor.publishComposite('profile', function (profileId) {
  return {
    find: function () {
      return Profiles.find({
        _id: profileId
      })
    },
    children: [{
      find: function (profile) {
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

Meteor.publish("developerUsers", function () {
  check(arguments, [Match.Any]);
  return [
    Users.find({ //this may publish users for not active status profiles
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

Meteor.publish('profiles', function (limit, query) {
  var selector = {};
  var options = {};
  check(limit, Number);
  check(query, Match.Maybe(Object));

  var textQuery = query.text;
  check(textQuery, Match.Maybe(String));

  var typeQuery = query.type;
  check(typeQuery, Match.Maybe(String));

  var availableForHireQuery = query.availableForHire;
  check(availableForHireQuery, Match.Maybe(Boolean));

  if(typeQuery)
    selector.type = typeQuery;

  if(availableForHireQuery)
    selector.availableForHire = true;

  options.limit = limit;

  if (!textQuery) {
    options.sort = {
      randomSorter: 1
    };
  } else {
    selector.$text = { $search: textQuery };
    options.fields = {
      score: { $meta: "textScore" }
    };
    options.sort = {
      score: { $meta: "textScore" }
    };
  }


  return Profiles.find(selector, options);
});
