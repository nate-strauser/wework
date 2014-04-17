UI.registerHelper("getPrettyDateAndTime", function(timestamp) {
	if(timestamp)
		return moment(timestamp).format('M/D/YY h:mm:ss A');
});

UI.registerHelper("getCurrentUserDisplayName", function() {
	return getUserName(Meteor.user());
});