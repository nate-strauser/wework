Template.jobDeactivate.events({
  "click .deactivate": function(event, template) {
    event.preventDefault();

    Meteor.call("deactivateJob", template.data._id, $(event.currentTarget).hasClass("filled"), function(error, result) {
      Modal.hide("jobDeactivate");
    });
  }
});
