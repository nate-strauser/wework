Template.jobsRecent.helpers({
	'timeFromLastJob':function(){
		var mostRecentJob = _.first(Jobs.find({},{sort:{createdAt:-1},limit:1}).fetch());
		if(mostRecentJob)
			return moment(mostRecentJob.createdAt).fromNow();
	}
});
