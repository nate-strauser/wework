getUserName = function(user){
	if (!user)
		return '';

	if (user.profile && user.profile.name)
		return user.profile.name;
	if (user.profile && user.profile.firstName && user.profile.lastName)
		return user.profile.firstName + " " + user.profile.lastName;
	if (user.username)
		return user.username;
	if (user.emails && user.emails[0] && user.emails[0].address)
		return user.emails[0].address;

	return '';
};

getUserEmail = function(user){
	if (user && user.emails && user.emails[0] && user.emails[0].address)
		return user.emails[0].address;
	else if (user && user.services && user.services.facebook && user.services.facebook.email)
		return user.services.facebook.email;
	else if (user && user.services && user.services.google && user.services.google.email)
		return user.services.google.email;
	else if (user && user.services && user.services.github && user.services.github.email)
		return user.services.github.email;
	else if (user && user.services && user.services.linkedin && user.services.linkedin.email)
		return user.services.linkedin.email;
	else if (user && user.services && user.services.twitter && user.services.twitter.email)
		return user.services.twitter.email;
	else if (user && user.services && user.services.meteor && user.services.meteor.email)
		return user.services.meteor.email;
};

daysUntilExpiration = function() {
    var daysToWait = 90;
    var daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate()-daysToWait);
    return daysAgo;
}
