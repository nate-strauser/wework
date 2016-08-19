AutoForm.addHooks(['profileNew', 'profileEdit'], {
  after: {
    insert: function(error, result) {
      if (error) {
        console.log("Insert Error:", error);
      } else {
        analytics.track("Profile Created");
        Router.go('profile', {
          _id: result
        });
      }
    },
    update: function(error, result) {
      if (error) {
        console.log("Update Error:", error);
      } else {
        analytics.track("Profile Edited");
        Router.go('profile', {
          _id: Router.current().params._id
        });
      }
    }
  }
});

Template.profileEdit.events({
  'click #cancel': function(event, template) {
    event.preventDefault();
    Router.go("profile", {
      _id: this.profile._id
    });
  }
})

var customImagePreviewUrl = new ReactiveVar();

Template.profileFields.rendered = function() {
  var interval;
  var template = this;
  interval = Meteor.setInterval(function() {
    if (typeof uploadcare !== "undefined") {
      Meteor.clearInterval(interval);
      var widget = uploadcare.SingleWidget('#custom-image');

      if (template.data && template.data.profile && template.data.profile.customImageUrl) {
        var customImage = template.data.profile.customImageUrl;
        if (customImage) {
          widget.value(customImage);
          customImagePreviewUrl.set(customImage);
        }
      }

      widget.onChange(function(file) {
        if (file) {
          file.done(function(info) {
            console.log(info);
            customImagePreviewUrl.set(info.cdnUrl);
            analytics.track("Profile Image Uploaded");
          });
        } else if (customImagePreviewUrl.get()) {
          customImagePreviewUrl.set(null);
        }
      });
    }
  }, 10);
};

Template.profileFields.helpers({
  "customImagePreviewUrl": function(event, template) {
    if (customImagePreviewUrl.get())
      return customImagePreviewUrl.get();
  }
});
