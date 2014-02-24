Session.setDefault('isExpert', false);

Meteor.startup(function(){
	Deps.autorun(function(){
		if(Meteor.user()){
			var expert = Experts.findOne({userId:Meteor.userId()});
			Session.set('isExpert', expert !== undefined);
		}else{
			Session.set('isExpert', false);
		}
	});
});