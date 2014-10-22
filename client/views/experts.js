AutoForm.addHooks(['expertNew', 'expertEdit'], {
	after: {
		insert: function(error, result) {
			if (error) {
				console.log("Insert Error:", error);
			} else {
				//console.log("Insert Result:", result);
				GAnalytics.event("expert","insert",getUserName(Meteor.user()));
				Router.go('expert', {_id:result});
			}
		},
		update: function(error, result) {
			if (error) {
				console.log("Update Error:", error);
			} else {
				//console.log("Update Result:", result);
				GAnalytics.event("expert","update",getUserName(Meteor.user()));
				Router.go('expert', {_id: Router.current().params._id});
			}
		}
	}
});

Template.expertEmbedLarge.helpers({
	beforeRemove: function () {
      return function (collection, id) {
        var doc = collection.findOne(id);
        if (confirm('Really delete "' + doc.title + '"?')) {
          this.remove();
          GAnalytics.event("expert","remove",getUserName(Meteor.user()));
		  Router.go('experts');
        }
      };
    }
});