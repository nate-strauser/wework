AutoForm.addHooks(['jobNew', 'jobEdit'], {
  after: {
    insert: function(error, result) {
      console.log('insert hoook')
      if (error) {
        console.log("Insert Error:", error);
      } else {
        analytics.track("Job Created");
        console.log('new job', {result})
        Router.go('job', { _id: result });
      }
    },
    update: function(error, result) {
      if (error) {
        console.log("Update Error:", error);
      } else {
        analytics.track("Job Edited");
        Router.go('job', { _id: Router.current().params._id });
      }
    }
  }
});

Template.jobEdit.events({
  'click #cancel': function(event, template) {
    event.preventDefault();
    Router.go("job", { _id: this.job._id });
  }
})
