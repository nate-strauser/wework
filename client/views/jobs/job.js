Template.job.events({
  'click #job-deactivate': function(event, template) {
    event.preventDefault();
    Modal.show('jobDeactivate', template.data);
  }
});

Template.job.helpers({
  'hasLabel': function() {
    return this.jobType || this.remote || this.featured;
  }
});
