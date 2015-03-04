AutoForm.addHooks(['userProfileEdit'], {
	after: {
		update: function(error, result) {
			if (error) {
				console.log(error);
			} else {
				GAnalytics.event("userProfile", "edit", getUserName(Meteor.user()));
				Modal.hide("userProfile");
			}
		}
	}
});

Template.userProfile.events({
	'click #cancel':function(event, template){
		event.preventDefault();
    	Modal.hide("userProfile");
	}
});
