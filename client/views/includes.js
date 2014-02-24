Template.header.helpers({
	expert:function(){
		return Experts.findOne({userId:Meteor.userId()});
	}
});