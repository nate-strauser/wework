AutoForm.addHooks(['jobNew', 'jobEdit'], {
	after: {
		insert: function(error, result) {
			if (error) {
				console.log("Insert Error:", error);
			} else {
				//console.log("Insert Result:", result);
				GAnalytics.event("expert","insert",getUserName(Meteor.user()));

				Router.go('job', {_id:result});
			}
		},
		update: function(error, result) {
			if (error) {
				console.log("Update Error:", error);
			} else {
				//console.log("Update Result:", result);
				GAnalytics.event("job","update",getUserName(Meteor.user()));

				Router.go('job', {_id: Router.current().params._id});
			}
		}
	}
});

Template.jobExpiredAlert.helpers({
	expired: function() {
		if (this.userId === Meteor.userId()) {
			if ((this.createdAt < daysUntilExpiration()) && (this.updatedAt < daysUntilExpiration())) {
				return true;
			} else if ((this.createdAt < daysUntilExpiration()) && (this.updatedAt === undefined)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
});


Template.jobEmbedLarge.helpers({
	beforeRemove: function () {
      return function (collection, id) {
        var doc = collection.findOne(id);
        if (confirm('Really delete "' + doc.title + '"?')) {
          this.remove();
          GAnalytics.event("job","remove",getUserName(Meteor.user()));
		  Router.go('jobs');
        }
      };
    }
});