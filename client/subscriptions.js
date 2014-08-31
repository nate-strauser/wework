subscriptionHandles = {
	user:Meteor.subscribe("userData"),
	jobs:Meteor.subscribe("jobs"),
    job:Meteor.subscribe("job"),
	experts:Meteor.subscribe("experts")
};

Meteor.startup(function(){
    Deps.autorun(function(){
        if(Meteor.user()){
            subscriptionHandles.my_jobs = Meteor.subscribe("my_jobs");
        }else{
            subscriptionHandles.user = undefined;
            subscriptionHandles.my_jobs = undefined;
        }
    });

    // Deps.autorun(function(){
    //     if(!Session.equals('jobId',undefined)){
    //         if(subscriptionHandles.job)
    //             subscriptionHandles.job.stop();
    //         subscriptionHandles.job = Meteor.subscribe("job", Session.get('jobId'));
    //     }else{
    //         if(subscriptionHandles.job)
    //             subscriptionHandles.job.stop();
    //         subscriptionHandles.job = undefined;
    //     }
    // });
});