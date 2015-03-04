AutoForm.addHooks(['profileNew', 'profileEdit'], {
  after: {
    insert: function(error, result) {
      if (error) {
        console.log("Insert Error:", error);
      } else {
        //console.log("Insert Result:", result);
        GAnalytics.event("profile", "insert", getUserName(Meteor.user()));
        Router.go('profile', {
          _id: result
        });
      }
    },
    update: function(error, result) {
      if (error) {
        console.log("Update Error:", error);
      } else {
        //console.log("Update Result:", result);
        GAnalytics.event("profile", "update", getUserName(Meteor.user()));
        Router.go('profile', {
          _id: Router.current().params._id
        });
      }
    }
  }
});
