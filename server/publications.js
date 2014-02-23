Meteor.publish("userData", function () {
	check(arguments, [Match.Any]);
	if(this.userId){
		return [
			Users.find({_id: this.userId})
		];
	}
});

Meteor.publish("jobs", function(){
	check(arguments, [Match.Any]);
	return [
		Jobs.find({})
	];
});

Meteor.publish("experts", function(){
	check(arguments, [Match.Any]);
	return [
		Experts.find({})
	];
});