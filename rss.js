RssFeed.publish('jobs', function(query) {
  var self = this;

  self.setValue('title', self.cdata('Recent Jobs'));
  self.setValue('description', self.cdata('This is a feed of recent jobs posted to We Work Meteor.'));
  self.setValue('link', 'http://wework.meteor.com');
  self.setValue('lastBuildDate', Jobs.findOne({}, {sort:{createdAt:-1}, skip: 1}).createdAt);
  self.setValue('pubDate', Jobs.findOne({}, {sort:{createdAt:-1}}).createdAt);
  self.setValue('ttl', 1);

  Jobs.find({}, {sort:{createdAt:-1}}).forEach(function(job) {
    self.addItem({
      title: job.title,
      description: job.description,
      link: 'http://wework.meteor.com/jobs/'+job._id,
      guid: 'http://wework.meteor.com/jobs/'+job._id,
      pubDate: job.createdAt
    });
  });
});

RssFeed.publish('experts', function(query) {
  var self = this;

  self.setValue('title', self.cdata('Recent Experts'));
  self.setValue('description', self.cdata('This is a feed of recent experts listed on We Work Meteor.'));
  self.setValue('link', 'http://wework.meteor.com');
  self.setValue('lastBuildDate', Experts.findOne({}, {sort:{createdAt:-1}, skip: 1}).createdAt);
  self.setValue('pubDate', Experts.findOne({}, {sort:{createdAt:-1}}).createdAt);
  self.setValue('ttl', 1);

  Experts.find({}, {sort:{createdAt:-1}}).forEach(function(expert) {
    self.addItem({
      title: expert.title,
      description: expert.description,
      link: 'http://wework.meteor.com/experts/'+expert._id,
      guid: 'http://wework.meteor.com/experts/'+expert._id,
      pubDate: expert.createdAt
    });
  });
});