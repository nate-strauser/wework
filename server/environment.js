Meteor.startup(function () {
	AccountsEntry.config({
		signupCode: null
	});
	if(Meteor.settings && Meteor.settings.apm && Meteor.settings.apm.id && Meteor.settings.apm.secret)
		Apm.connect(Meteor.settings.apm.id, Meteor.settings.apm.secret);
});