Meteor.startup(function () {
	if(Meteor.settings && Meteor.settings.apm && Meteor.settings.apm.id && Meteor.settings.apm.secret){
		Apm.connect(Meteor.settings.apm.id, Meteor.settings.apm.secret);
	}else{
		console.log('apm init skipped, missing settings');
	}
});