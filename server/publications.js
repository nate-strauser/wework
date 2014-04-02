Meteor.publish("userData", function () {
	check(arguments, [Match.Any]);
	if(this.userId){
		return [
			Users.find({_id: this.userId})
		];
	}
	this.ready();
});

Meteor.publish("jobs", function(){
	var daysAgo = new Date();
	daysAgo.setDate(daysAgo.getDate()-90);
	check(arguments, [Match.Any]);
	return [
		Jobs.find({"createdAt": { $gte: daysAgo }})
	];
});

Meteor.publish("experts", function(){
	check(arguments, [Match.Any]);
	return [
		Experts.find({})
	];
});