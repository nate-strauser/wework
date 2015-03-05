Template.job.helpers({
  beforeRemove: function() {
    return function(collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Really delete "' + doc.title + '"?')) {
        this.remove();
        GAnalytics.event("job", "remove", getUserName(Meteor.user()));
        Router.go('myJobs');
      }
    };
  }
});
