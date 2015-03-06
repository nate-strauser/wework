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
Meteor.subscribe("jobCount");
Meteor.subscribe("developerCount");

Router.map(function() {
  this.route('home', {
    path: '/',
    layoutTemplate:'layoutNoContainer',
    data: function() {
      return {
        jobs: Jobs.find({
          status:"active"
        }, {
          sort: {
            createdAt: -1
          },
          limit: 10
        }),
        profiles: Profiles.find({}, {
          sort: {
            availableForHire: -1,
            randomSorter: 1
          },
          limit: 8
        }),
        profile: Profiles.findOne({
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
        jobs: Jobs.find({
          status:"active"
        }, {
          sort: {
            createdAt: -1
          }
        })
      };
    },
    waitOn: function() {
      return subs.subscribe('jobs');
    }
  });

  this.route('myJobs', {
    path: '/myjobs',
    data: function() {
      return {
        jobs: Jobs.find({
          userId:Meteor.userId()
        }, {
          sort: {
            createdAt: -1
          }
        })
      };
    },
    waitOn: function() {
      return subs.subscribe('my_jobs');
    }
  });

  this.route('job', {
    path: '/jobs/:_id',
    data: function() {
      return Jobs.findOne({
        _id: this.params._id
      });
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

  this.route('profiles', {
    path: '/profiles',
    data: function() {
      return {
        profiles: Profiles.find({}, {
          sort: {
            randomSorter: 1
          }
        })
      };
    },
    waitOn: function() {
      return subs.subscribe('profiles');
    }
  });

  this.route('profile', {
    path: '/profiles/:_id',
    data: function() {
      return Profiles.findOne({
          _id: this.params._id
        });
    },
    waitOn: function() {
      return subs.subscribe('profile', this.params._id);
    }
  });

  this.route('profileNew', {
    path: '/profile',
    onBeforeAction: function() {
      if (Meteor.user().isDeveloper) {
        Router.go('profile', Profiles.findOne({
          userId: Meteor.userId()
        }));
      } else {
        this.next();
      }
    }
  });

  this.route('profileEdit', {
    path: '/profiles/:_id/edit',
    data: function() {
      return {
        profile: Profiles.findOne({
          _id: this.params._id
        })
      };
    },
    waitOn: function() {
      return subs.subscribe('profile', this.params._id);
    }
  });

  //legacy url redirects
  this.route('experts', function(){
    this.redirect("profiles");
  });
  this.route('experts/:_id', function(){
    this.redirect("profile", {_id:this.params._id});
  });
});

Router.onBeforeAction(AccountsTemplates.ensureSignedIn, {
  only: ['profileEdit', 'profileNew', 'jobEdit', 'jobNew']
});


Router.onBeforeAction(function(){
  loadUploadcare();
  this.next();
},{only:['profileEdit','profileNew','jobEdit','jobNew']});

Router.plugin('dataNotFound', {notFoundTemplate: 'notFound'});

Router.onRun(function() {
  GAnalytics.pageview();
});
