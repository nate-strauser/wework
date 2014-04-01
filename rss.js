RssFeed.publish('jobs', function(query) {
  var self = this;
  // We got 3 helpers:
  // 1. self.setValue
  // 2. self.addItem
  // 3. self.cdata


  // query is the parsed querystring as an object
  // eg. foo=latest would be query.foo === 'latest'

  // feed handler helpers
  // this.cdata, this.setValue, this.addItem
  self.setValue('title', self.cdata('Recent Jobs'));
  self.setValue('description', self.cdata('This is a feed of recent jobs posted to We Work Meteor.'));
  self.setValue('link', 'http://wework.meteor.com');
  self.setValue('lastBuildDate', new Date());
  self.setValue('pubDate', new Date());
  self.setValue('ttl', 1);
  // managingEditor, webMaster, language, docs, generator

  Jobs.find({}).forEach(function(job) {
    self.addItem({
      title: job.title,
      description: job.description,
      link: 'http://wework.meteor.com/jobs/'+job._id,
      company: job.company,
      location: job.location,
      companyURL: job.url,
      remote: job.remote,
      found: job.found,
      pubDate: new Date()
      // title, description, link, guid, pubDate
    });
  });
});