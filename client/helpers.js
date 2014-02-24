Handlebars.registerHelper("getPrettyDateAndTime", function(timestamp) {
	if(timestamp)
		return moment(timestamp).format('M/D/YY h:mm:ss A');
});

Handlebars.registerHelper("getCurrentUserDisplayName", function() {
	return getUserName(Meteor.user());
});


Handlebars.registerHelper('ifNotEmpty', function(collection, options) {
	if(collection){
		if(collection.count() > 0){
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	}else{
		return options.inverse(this);
	}
});