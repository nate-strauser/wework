Handlebars.registerHelper("getPrettyDateAndTime", function(timestamp) {
	if(timestamp)
		return moment(timestamp).format('M/D/YY h:mm:ss A');
});