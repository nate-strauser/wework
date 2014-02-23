Session.setDefault('hoursOffset', 0);

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  yieldTemplates:{
    header:{to:'header'},
    footer:{to:'footer'}
  }
});

Router.map(function () {
  this.route('home', {
    path: '/',
    template: 'home'
  });

  this.route('dashboard', {
    path: '/dashboard',
    data: function () {
      return {
        recentSubmissions:Submissions.find({},{sort:{timestamp:-1},limit:5}),
        recentAchievements:Achievements.find({},{sort:{timestamp:-1},limit:5}),
        recentSessions:Sessions.find({},{sort:{timestamp:-1},limit:5})
      };
    },
    waitOn: function(){
      return subscriptionHandles.user;
    }
  });

  this.route('jobs', {
    path: '/jobs',
    data: function () {
      return {
        jobs:Jobs.find({},{sort:{timestamp:-1}})
      };
    },
    waitOn: function(){
      return subscriptionHandles.jobs;
    }
  });

  this.route('jobs', {
    path: '/jobs/:_id',
    data: function () {
      return {
        jobs:Jobs.findOne({_id:this.params._id})
      };
    },
    waitOn: function(){
      return subscriptionHandles.jobs;
    }
  });

});

AccountsEntry.config({
  homeRoute: '/',
  dashboardRoute: '/dashboard'
});