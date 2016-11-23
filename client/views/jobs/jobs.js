Template.jobs.onCreated(function() {
  this.query = new ReactiveVar({});
  this.infiniteScroll({
    perPage: 30,
    subManager: subs,
    collection: Jobs,
    publication: 'jobs',
    query: this.query
  });
});

Template.jobs.helpers({
  "jobs": function() {

    var query = Template.instance().query.get();
    var options = {
      sort: {
        featuredThrough: -1,
        createdAt: -1
      }
    };

    let jobs = Jobs.find(query, options);

    if(jobs.count() > 0){
      return jobs;
    }

    return false;
  },
  "JOB_TYPES": function() {
    return JOB_TYPES;
  }
})

Template.jobs.events({
  'change #jobType': function (event, template) {
    let type = event.currentTarget.value;
    if(type === "All") {
      template.query.set({})
    }else{
      template.query.set({jobtype: type})
    }
  }
});