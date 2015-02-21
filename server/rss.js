RssFeed.publish('jobs', function(query) {
  var self = this;
  var pubDate = new Date();
  var lastBuildDate = new Date();
  var mostRecent = Jobs.findOne({}, {sort:{createdAt:-1}});
  var secondMostRecent = Jobs.findOne({}, {sort:{createdAt:-1}, skip: 1});
  if(mostRecent)
    pubDate = mostRecent.createdAt;
  if(secondMostRecent)
    lastBuildDate = secondMostRecent.createdAt;

  self.setValue('title', self.cdata('We Work Meteor - Recent Jobs'));
  self.setValue('description', self.cdata('This is a feed of recent jobs posted to We Work Meteor.'));
  self.setValue('link', Meteor.absoluteUrl());
  self.setValue('lastBuildDate', lastBuildDate);
  self.setValue('pubDate', pubDate);
  self.setValue('ttl', 1);

  Jobs.find({}, {sort:{createdAt:-1}}).forEach(function(job) {
    self.addItem({
      title: self.cdata(job.title),
      description: self.cdata(job.htmlDescription),
      link: Meteor.absoluteUrl('jobs/'+job._id),
      guid: Meteor.absoluteUrl('jobs/'+job._id),
      pubDate: job.createdAt
    });
  });
});

RssFeed.publish('experts', function(query) {
  var self = this;
  var pubDate = new Date();
  var lastBuildDate = new Date();
  var mostRecent = Experts.findOne({}, {sort:{createdAt:-1}});
  var secondMostRecent = Experts.findOne({}, {sort:{createdAt:-1}, skip: 1});
  if(mostRecent)
    pubDate = mostRecent.createdAt;
  if(secondMostRecent)
    lastBuildDate = secondMostRecent.createdAt;

  self.setValue('title', self.cdata('We Work Meteor - Recent Experts'));
  self.setValue('description', self.cdata('This is a feed of recent experts listed on We Work Meteor.'));
  self.setValue('link', Meteor.absoluteUrl());
  self.setValue('lastBuildDate', lastBuildDate);
  self.setValue('pubDate', pubDate);
  self.setValue('ttl', 1);

  Experts.find({}, {sort:{createdAt:-1}}).forEach(function(expert) {
    self.addItem({
      title: self.cdata(expert.title),
      description: self.cdata(expert.htmlDescription),
      link: Meteor.absoluteUrl('experts/'+expert._id),
      guid: Meteor.absoluteUrl('experts/'+expert._id),
      pubDate: expert.createdAt
    });
  });
});
