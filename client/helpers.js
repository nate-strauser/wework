UI.registerHelper("formatDate", function(timestamp) {
	if(timestamp)
		return moment(timestamp).format('M/D/YY');
});

UI.registerHelper("currentUserDisplayName", function() {
	return getUserName(Meteor.user());
});


UI.registerHelper("currentUserEmail", function() {
	return getUserEmail(Meteor.user());
});
