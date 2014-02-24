getUserName = function(user){
	if (!user)
		return '';

	if (user.profile && user.profile.name)
		return user.profile.name;
	if (user.username)
		return user.username;
	if (user.emails && user.emails[0] && user.emails[0].address)
		return user.emails[0].address;

	return '';
};