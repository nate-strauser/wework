Template.header.helpers({
  profile: function() {
    return Profiles.findOne({
      userId: Meteor.userId()
    });
  }
});

Template.header.events({
  'click #signOut': function(event, template) {
    Meteor.logout();
    Router.go("/");
  },
  'click .navbar-nav a': function() {
    var targetButton = document.getElementsByClassName('navbar-toggle')[0];
    if (window.innerWidth < 768) {
      targetButton.click()
    }
  },
  'click #userProfile': function(event, template) {
    event.preventDefault();
    Modal.show('userProfile');
  }
});
