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
  'click .navbar-nav a': function(event, template) {
    var targetButton = document.getElementsByClassName('navbar-toggle')[0];
    var _this = $(event.currentTarget); 

    if (window.innerWidth < 768) {
      if( !_this.hasClass('box-user-option') ){
         targetButton.click()
      }
    }
  },
  'click #userProfile': function(event, template) {
    event.preventDefault();
    Modal.show('userProfile');
  }
});
