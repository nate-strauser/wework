AutoForm.addHooks(['expertNew', 'expertEdit', 'expertDelete'], {
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
				Router.go('expert', {_id: Session.get('editingExpertId')});
			}
		},
		remove: function(error, result) {
			if (error) {
				console.log("Remove Error:", error);
			} else {
				//console.log("Insert Result:", result);
				GAnalytics.event("expert","remove",getUserName(Meteor.user()));
				Router.go('experts');
			}
		}
	}
});