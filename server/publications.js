Meteor.publish("userData", function () {
	check(arguments, [Match.Any]);
	if(this.userId){
		return [
			Users.find({_id: this.userId})
		];
	}
	this.ready();
});

Meteor.publish('jobCount', function() {
  Counts.publish(this, 'jobs', Jobs.find({$or: [ {"createdAt": { $gte: daysUntilExpiration() }}, {"updatedAt": { $gte: daysUntilExpiration() }}] }));
});

Meteor.publish('developerCount', function() {
  Counts.publish(this, 'developers', Experts.find());
});

Meteor.publish("homeJobs", function(){
	check(arguments, [Match.Any]);
	return [
		Jobs.find({$or: [ {"createdAt": { $gte: daysUntilExpiration() }}, {"updatedAt": { $gte: daysUntilExpiration() }}] },{sort:{createdAt:-1},limit:15})
	];
});


Meteor.publishComposite('homeDevelopers', {
    find: function() {
        return Experts.find({}, { 
        	sort: { 
        		availableForHire: -1,
        		randomSorter: 1 
        	}, 
        	limit: 8 });
    },
    children: [
        {
            find: function(expert) {
                return Users.find(
			            {_id: expert.userId },
			            {
			            	fields: { 
				            	"emailHash":true,
				            	"services.facebook.id" : true,
							    "services.twitter.profile_image_url":true,
								"services.facebook.id":true,
								"services.google.picture":true,
								"services.github.username":true 
							} 
						}
					);
            }
        }
    ]
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
		Experts.find({}),
		Users.find(
            {isDeveloper: true },
            {
            	fields: { 
	            	"emailHash":true,
	            	"services.facebook.id" : true,
				    "services.twitter.profile_image_url":true,
					"services.facebook.id":true,
					"services.google.picture":true,
					"services.github.username":true 
				} 
			}
		)
	];
});
