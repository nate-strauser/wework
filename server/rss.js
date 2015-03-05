RssFeed.publish('jobs', function(query) {
  var self = this;
  var pubDate = new Date();
  var lastBuildDate = new Date();
  var mostRecent = Jobs.findOne({}, {
    sort: {
      createdAt: -1
    }
  });
  var secondMostRecent = Jobs.findOne({}, {
    sort: {
      createdAt: -1
    },
    skip: 1
  });
  if (mostRecent)
    pubDate = mostRecent.createdAt;
  if (secondMostRecent)
    lastBuildDate = secondMostRecent.createdAt;

  self.setValue('title', self.cdata('We Work Meteor - Recent Jobs'));
  self.setValue('description', self.cdata('This is a feed of recent jobs posted to We Work Meteor.'));
  self.setValue('link', Meteor.absoluteUrl());
  self.setValue('lastBuildDate', lastBuildDate);
  self.setValue('pubDate', pubDate);
  self.setValue('ttl', 1);

  Jobs.find({
    status: "active"
  }, {
    sort: {
      createdAt: -1
    }
  }).forEach(function(job) {
    self.addItem({
      title: self.cdata(job.title),
      description: self.cdata(job.htmlDescription),
      link: Meteor.absoluteUrl('jobs/' + job._id),
      guid: Meteor.absoluteUrl('jobs/' + job._id),
      pubDate: job.createdAt
    });
  });
});

var profileRss = function(query) {
  var self = this;
  var pubDate = new Date();
  var lastBuildDate = new Date();
  var mostRecent = Profiles.findOne({}, {
    sort: {
      createdAt: -1
    }
  });
  var secondMostRecent = Profiles.findOne({}, {
    sort: {
      createdAt: -1
    },
    skip: 1
  });
  if (mostRecent)
    pubDate = mostRecent.createdAt;
  if (secondMostRecent)
    lastBuildDate = secondMostRecent.createdAt;

  self.setValue('title', self.cdata('We Work Meteor - Recent Profiles'));
  self.setValue('description', self.cdata('This is a feed of recent profiles listed on We Work Meteor.'));
  self.setValue('link', Meteor.absoluteUrl());
  self.setValue('lastBuildDate', lastBuildDate);
  self.setValue('pubDate', pubDate);
  self.setValue('ttl', 1);

  Profiles.find({
    status: "active"
  }, {
    sort: {
      createdAt: -1
    }
  }).forEach(function(profile) {
    self.addItem({
      title: self.cdata(profile.title),
      description: self.cdata(profile.htmlDescription),
      link: Meteor.absoluteUrl('profiles/' + profile._id),
      guid: Meteor.absoluteUrl('profiles/' + profile._id),
      pubDate: profile.createdAt
    });
  });
};

RssFeed.publish('profiles', profileRss)

RssFeed.publish('experts', profileRss);
