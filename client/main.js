Router.configure({
  layoutTemplate: 'layout',
  yieldTemplates: {
    header: {
      to: 'header'
    },
    footer: {
      to: 'footer'
    }
  },
  progressSpinner: false
});

var subs = new SubsManager({
  cacheLimit: 20,
  expireIn: 5
});


Meteor.subscribe("userData");
Meteor.subscribe("jobCount");
Meteor.subscribe("developerCount");

var randomSorterDirection = Random.choice([1,-1]);

Router.map(function() {
  this.route('home', {
    path: '/',
    layoutTemplate:'layoutNoContainer',
    data: function() {
      return {
        jobs: Jobs.find({}, {
          sort: {
            createdAt: -1
          },
          limit: 15
        }),
        experts: Experts.find({}, {
          sort: {
            randomSorter: randomSorterDirection
          },
          limit: 8
        }),
        expert: Experts.findOne({
          userId: Meteor.userId()
        })
      };
    },
    subscriptions: function() {
      return [subs.subscribe('homeJobs'), subs.subscribe('homeDevelopers')];
    }
  });

  this.route('jobs', {
    path: '/jobs',
    data: function() {
      return {
        jobs: Jobs.find({}, {
          sort: {
            createdAt: -1
          }
        })
      };
    },
    subscriptions: function() {
      return [subs.subscribe('jobs'), subs.subscribe('my_jobs')];
    }
  });

  this.route('job', {
    path: '/jobs/:_id',
    data: function() {
      return {
        job: Jobs.findOne({
          _id: this.params._id
        })
      };
    },
    subscriptions: function() {
      return subs.subscribe("job", this.params._id);
    }
  });

  this.route('jobNew', {
    path: '/job'
  });

  this.route('jobEdit', {
    path: '/jobs/:_id/edit',
    data: function() {
      return {
        job: Jobs.findOne({
          _id: this.params._id
        })
      };
    },
    subscriptions: function() {
      return subs.subscribe("job", this.params._id);
    }
  });

  this.route('experts', {
    path: '/experts',
    data: function() {
      return {
        experts: Experts.find({}, {
          sort: {
            randomSorter: randomSorterDirection
          }
        })
      };
    },
    subscriptions: function() {
      return subs.subscribe('experts');
    }
  });

  this.route('expert', {
    path: '/experts/:_id',
    data: function() {
      return {
        expert: Experts.findOne({
          _id: this.params._id
        })
      };
    },
    subscriptions: function() {
      return subs.subscribe('experts');
    }
  });

  this.route('expertNew', {
    path: '/expert',
    onBeforeAction: function() {
      if (Session.equals('isExpert', true)) {
        Router.go('expert', Experts.findOne({
          userId: Meteor.userId()
        }));
      } else {
        this.next();
      }
    }
  });

  this.route('expertEdit', {
    path: '/experts/:_id/edit',
    data: function() {
      return {
        expert: Experts.findOne({
          _id: this.params._id
        })
      };
    },
    subscriptions: function() {
      return subs.subscribe('experts');
    }
  });
});

Router.onBeforeAction(AccountsTemplates.ensureSignedIn, {
  only: ['expertEdit', 'expertNew', 'jobEdit', 'jobNew']
});

Router.onRun(function() {
  GAnalytics.pageview();
});
