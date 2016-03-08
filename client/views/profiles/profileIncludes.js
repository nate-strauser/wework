Template.profileStatusToggle.helpers({
  "statuses": function() {
    return PROFILE_STATUSES;
  }
});

Template.profileStatusToggle.events({
  "click .set-status": function(event, template) {
    event.preventDefault();
    Meteor.call("adminSetProfileStatus", template.data._id, String(this));
  }
});
