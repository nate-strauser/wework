UI.registerHelper("getPrettyDateAndTime", function(timestamp) {
	if(timestamp)
		return moment(timestamp).format('M/D/YY h:mm:ss A');
});

UI.registerHelper("getCurrentUserDisplayName", function() {
	return getUserName(Meteor.user());
});

Template.expiredAlert.expired = function() {
    if (this.userId == Meteor.userId()) {
        if (this.createdAt < daysUntilExpiration() && this.updatedAt < daysUntilExpiration()) {
            return true
        } else if (this.createdAt < daysUntilExpiration()) {
            return true
        } else {
            return false;
        }
    } else {
        return false;
    }    
}