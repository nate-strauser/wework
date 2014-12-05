IronRouterProgress.configure({
    spinner : false
});

Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	yieldTemplates:{
		header:{to:'header'},
		footer:{to:'footer'}
	},
	progress: {
		spinner:false
	}
});

var subs = new SubsManager({
  // will be cached only 20 recently used subscriptions
  cacheLimit: 20,
  // any subscription will be expired after 5 minutes of inactivity
  expireIn: 5
});


Meteor.subscribe("userData");

Router.map(function () {
	this.route('home', {
		path: '/',
		data: function () {
			if (!this.ready()) return;
			return {
				jobs:Jobs.find({},{sort:{createdAt:-1},limit:5}),
				experts:Experts.find({},{sort:{createdAt:-1},limit:5}),
				myJobsCount:Jobs.find({userId:Meteor.userId()}).count(),
				expert:Experts.findOne({userId:Meteor.userId()})
			};
		},
		waitOn: function(){
			return [subs.subscribe('jobs'),subs.subscribe('my_jobs'),subs.subscribe('experts')];
		}
	});

	this.route('jobs', {
		path: '/jobs',
		data: function () {
			if (!this.ready()) return;
			return {
				jobs:Jobs.find({},{sort:{createdAt:-1}}),
				jobCount:Jobs.find({}).count()
			};
		},
		waitOn: function(){
			return [subs.subscribe('jobs'),subs.subscribe('my_jobs')];
		}
	});

	this.route('job', {
		path: '/jobs/:_id',
		data: function () {
			if (!this.ready()) return;
			return {
				job:Jobs.findOne({_id:this.params._id})
			};
		},
		waitOn: function(){
			return subs.subscribe("job", this.params._id);
		}
	});

	this.route('jobNew', {
		path: '/job'
	});

	this.route('jobEdit', {
		path: '/jobs/:_id/edit',
		data: function () {
			if (!this.ready()) return;
			return {
				job:Jobs.findOne({_id:this.params._id})
			};
		},
		waitOn: function(){
			return subs.subscribe("job", this.params._id);
		}
	});

	this.route('experts', {
		path: '/experts',
		data: function () {
			if (!this.ready()) return;
			return {
				experts:Experts.find({},{sort:{createdAt:-1}}),
				expertCount:Experts.find({}).count()
			};
		},
		waitOn: function(){
			return subs.subscribe('experts');
		}
	});

	this.route('expert', {
		path: '/experts/:_id',
		data: function () {
			if (!this.ready()) return;
			return {
				expert:Experts.findOne({_id:this.params._id})
			};
		},
		waitOn: function(){
			return subs.subscribe('experts');
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
			if (!this.ready()) return;
			return {
				expert:Experts.findOne({_id:this.params._id})
			};
		},
		waitOn: function(){
			return subs.subscribe('experts');
		}
	});
});


Router.onBeforeAction(AccountsTemplates.ensureSignedIn,{only:['expertEdit','expertNew','jobEdit','jobNew']});

Router.onRun(function(){
	GAnalytics.pageview();
	$("html, body").animate({ scrollTop: 0 }, "slow");
});
