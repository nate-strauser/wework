Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
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

Router.map(function() {
  this.route('home', {
    path: '/',
    data: function() {
      return {
        jobs: Jobs.find({}, {
          sort: {
            createdAt: -1
          },
          limit: 5
        }),
        experts: Experts.find({}, {
          sort: {
            createdAt: -1
          },
          limit: 5
        }),
        myJobsCount: Jobs.find({
          userId: Meteor.userId()
        }).count(),
        expert: Experts.findOne({
          userId: Meteor.userId()
        })
      };
    },
    waitOn: function() {
      return [subs.subscribe('jobs'), subs.subscribe('my_jobs'), subs.subscribe('experts')];
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
        }),
        jobCount: Jobs.find({}).count()
      };
    },
    waitOn: function() {
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
    waitOn: function() {
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
    waitOn: function() {
      return subs.subscribe("job", this.params._id);
    }
  });

  this.route('experts', {
    path: '/experts',
    data: function() {
      return {
        experts: Experts.find({}, {
          sort: {
            createdAt: -1
          }
        }),
        expertCount: Experts.find({}).count()
      };
    },
    waitOn: function() {
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
    waitOn: function() {
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
    waitOn: function() {
      return subs.subscribe('experts');
    }
  });
});


Router.onBeforeAction(AccountsTemplates.ensureSignedIn, {
  only: ['expertEdit', 'expertNew', 'jobEdit', 'jobNew']
});

Router.onRun(function() {
  GAnalytics.pageview();
  $("html, body").animate({
    scrollTop: 0
  }, "slow");
});