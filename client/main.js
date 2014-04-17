Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	yieldTemplates:{
		header:{to:'header'},
		footer:{to:'footer'}
	},
	disableProgressSpinner:true
});

Router.map(function () {
	this.route('home', {
		path: '/',
		data: function () {
			return {
				jobs:Jobs.find({},{sort:{createdAt:-1},limit:5}),
				experts:Experts.find({},{sort:{createdAt:-1},limit:5}),
				myJobsCount:Jobs.find({userId:Meteor.userId()}).count(),
				expert:Experts.findOne({userId:Meteor.userId()})
			};
		},
		waitOn: function(){
			return [subscriptionHandles.jobs, subscriptionHandles.my_jobs, subscriptionHandles.experts];
		},
		disableProgress : true
	});

	this.route('jobs', {
		path: '/jobs',
		data: function () {
			return {
				jobs:Jobs.find({},{sort:{createdAt:-1}}),
				jobCount:Jobs.find({}).count()
			};
		},
		waitOn: function(){
			return [subscriptionHandles.jobs, subscriptionHandles.my_jobs];
		}
	});

	this.route('job', {
		path: '/jobs/:_id',
		onRun: function() {
			Session.set('jobId', this.params._id);
		},
		data: function () {
			return {
				job:Jobs.findOne({_id:this.params._id})
			};
		},
		waitOn: function(){
			return subscriptionHandles.job;
		}
	});

	this.route('jobNew', {
		path: '/job'
	});

	this.route('jobEdit', {
		path: '/jobs/:_id/edit',
		data: function () {
			Session.set('editingJobId', this.params._id);
			return {
				job:Jobs.findOne({_id:this.params._id})
			};
		},
		waitOn: function(){
			return subscriptionHandles.jobs;
		},
		onStop: function () {
			// This is called when you navigate to a new route
			Session.set('editingJobId', null);
		}
	});

	this.route('experts', {
		path: '/experts',
		data: function () {
			return {
				experts:Experts.find({},{sort:{createdAt:-1}}),
				expertCount:Experts.find({}).count()
			};
		},
		waitOn: function(){
			return subscriptionHandles.experts;
		}
	});

	this.route('expert', {
		path: '/experts/:_id',
		data: function () {
			return {
				expert:Experts.findOne({_id:this.params._id})
			};
		},
		waitOn: function(){
			return subscriptionHandles.experts;
		}
	});

	this.route('expertNew', {
		path: '/expert',
		onBeforeAction: function(){
			if (Session.equals('isExpert', true)) {
				this.stop();
				Router.go('expert', Experts.findOne({userId:Meteor.userId()}));
			}
		}
	});

	this.route('expertEdit', {
		path: '/experts/:_id/edit',
		data: function () {
			Session.set('editingExpertId', this.params._id);
			return {
				expert:Experts.findOne({_id:this.params._id})
			};
		},
		waitOn: function(){
			return subscriptionHandles.experts;
		},
		onStop: function () {
			// This is called when you navigate to a new route
			Session.set('editingExpertId', null);
		}
	});
});


Router.onBeforeAction(function(){
	if (!Meteor.user() && !Meteor.loggingIn()) {
		AccountsEntry.signInRequired(this, true);
    }

},{only:['expertEdit','expertNew','jobEdit','jobNew']});

Router.onRun(function(){
	GAnalytics.pageview();
	$("html, body").animate({ scrollTop: 0 }, "slow");
});

AccountsEntry.config({
	homeRoute: '/',
	dashboardRoute: '/',
	passwordSignupFields: 'USERNAME_AND_EMAIL'
});