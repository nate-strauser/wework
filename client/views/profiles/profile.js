Template.profile.helpers({
  beforeRemove: function() {
    return function(collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Really delete "' + doc.title + '"?')) {
        this.remove();
        analytics.track("Profile Removed");
        Router.go('profiles');
      }
    };
  },
  splitInterestedIn: function() {
    if (interestedIn)
      return interestedIn.split(",");
  }
});
