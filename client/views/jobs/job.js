Template.job.events({
  'click #job-deactivate': function(event, template) {
    event.preventDefault();
    Modal.show('jobDeactivate', template.data);
  },

  'click #im-interested': function(event, template) {
    event.preventDefault();

    Meteor.call("registerJobInterest", template.data._id, function(error, result) {
      //Modal.hide("jobDeactivate");
    });
  }
});

Template.job.helpers({
  'hasLabel': function() {
    return this.jobType || this.remote || this.featured;
  }
});
