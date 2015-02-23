UI.registerHelper("getPrettyDateAndTime", function(timestamp) {
	if(timestamp)
		return moment(timestamp).format('M/D/YY');
});

UI.registerHelper("getCurrentUserDisplayName", function() {
	return getUserName(Meteor.user());
});

UI.registerHelper("isActiveRoute", function(name, _id){
	if(Router.current().route.name === name){
		if(!_id.hash){
			if(_id === Router.current().params._id)
				return 'active';
		}else{
			return 'active';
		}
	}
});

UI.registerHelper("isCurrentRoute", function(name, _id){
	if(Router.current().route.name === name){
		if(!_id.hash){
			if(_id === Router.current().params._id)
				return true;
		}else{
			return true;
		}
	}
});
