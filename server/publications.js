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
	check(arguments, [Match.Any]);
	return [
		Jobs.find({$or: [ {"createdAt": { $gte: daysUntilExpiration() }}, {"updatedAt": { $gte: daysUntilExpiration() }}] })
	];
});

Meteor.publish("my_jobs", function(){
    check(arguments, [Match.Any]);
    if(this.userId){
        return [
            Jobs.find({userId:this.userId})
        ];
    }
    this.ready();
});

// Used for returning single job at permalink
Meteor.publish("job", function(jobId){
	check(arguments, [Match.Any]);
    return [
        Jobs.find({_id:jobId})
    ];
});

Meteor.publish("experts", function(){
	check(arguments, [Match.Any]);
	return [
		Experts.find({})
	];
});