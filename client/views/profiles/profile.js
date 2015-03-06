Template.profile.helpers({
  beforeRemove: function() {
    return function(collection, id) {
      var doc = collection.findOne(id);
      if (confirm(TAPi18n.__("confirm_deletion", doc.title))) {
        this.remove();
        ga("send", "event", "profile", "remove", doc.title);
        Router.go('profiles');
      }
    };
  },
  splitInterestedIn: function() {
    if (interestedIn)
      return interestedIn.split(",");
  }
});
