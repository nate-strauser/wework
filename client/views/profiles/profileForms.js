AutoForm.addHooks(['profileNew', 'profileEdit'], {
  after: {
    insert: function(error, result) {
      if (error) {
        console.log("Insert Error:", error);
      } else {
        ga("send", "event", "profile", "insert", result.title);
        Router.go('profile', {
          _id: result
        });
      }
    },
    update: function(error, result) {
      if (error) {
        console.log("Update Error:", error);
      } else {
        ga("send", "event", "profile", "update", result.title);
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
      
      if(template.data && template.data.profile && template.data.profile.customImageUrl){
        var customImage = template.data.profile.customImageUrl;
        if(customImage){
          widget.value(customImage);
          customImagePreviewUrl.set(customImage);
        }
      }

      widget.onChange(function(file) {
        if (file) {
          file.done(function(info) {
            console.log(info);
            customImagePreviewUrl.set(info.cdnUrl);
            if(template.data && template.data.profile && template.data.profile.title)
              ga("send", "event", "profile", "imageUploaded", template.data.profile.title);
            else
              ga("send", "event", "profile", "imageUploaded");
              
          });
        } else if(customImagePreviewUrl.get()){
          	customImagePreviewUrl.set(null);
        }
      });
    }
  }, 10);
};

Template.profileFields.helpers({
  "customImagePreviewUrl": function(event, template) {
    if(customImagePreviewUrl.get())
    	return customImagePreviewUrl.get();
  }
});
