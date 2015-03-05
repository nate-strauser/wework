Accounts.emailTemplates.siteName = "We Work Meteor";
Accounts.emailTemplates.from = FROM_EMAIL;

Accounts.onCreateUser(function(options, user) {
  if (options.profile)
    user.profile = options.profile;

  var email = getUserEmail(user);
  if(email){
  	user.emailHash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
  }
  
  return user;
});
