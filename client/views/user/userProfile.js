AutoForm.addHooks(['userProfileEdit'], {
  after: {
    update: function(error, result) {
      if (error) {
        console.log(error);
      } else {
        analytics.track("User Profile Edited");
        Modal.hide("userProfile");
      }
    }
  }
});

Template.userProfile.events({
  'click #cancel': function(event, template) {
    event.preventDefault();
    Modal.hide("userProfile");
  }
});
