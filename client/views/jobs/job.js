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
  },

  'interestedIn': function () {
    if ( Meteor.user().interestedInJobIds ) {
      return Meteor.user().interestedInJobIds.includes(this._id)
    } else {
      return false;
    }
  }
});
