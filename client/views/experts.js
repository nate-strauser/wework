var expertsForm = new AutoForm(Experts);

expertsForm.hooks({
	after: {
		insert: function(error, result) {
			if (error) {
				console.log("Insert Error:", error);
			} else {
				//console.log("Insert Result:", result);
				Router.go('expert', {_id:result});
			}
		},
		update: function(error, result) {
			if (error) {
				console.log("Update Error:", error);
			} else {
				//console.log("Update Result:", result);
				Router.go('expert', {_id: Session.get('editingExpertId')});
			}
		},
		remove: function(error, result) {
			if (error) {
				console.log("Remove Error:", error);
			} else {
				//console.log("Insert Result:", result);
				Router.go('experts');
			}
		}
	}
});

var baseHelpers = {
	expertsForm:function(){
		return expertsForm;
	}
};

Template.expertNew.helpers(baseHelpers);
Template.expertEdit.helpers(baseHelpers);
Template.expertEmbedLarge.helpers(baseHelpers);
