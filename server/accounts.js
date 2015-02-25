Accounts.onCreateUser(function(options, user) {
  var email = getUserEmail(user);
  if(email)
  	user.emailHash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
  
  if (options.profile)
    user.profile = options.profile;
  return user;
});
