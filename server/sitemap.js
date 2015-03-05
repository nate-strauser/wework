sitemaps.add('/sitemap.xml', function() {
  var out = [];
  var jobs = Jobs.find({status: "active"}, {sort: {createdAt: -1}}).fetch();
  _.each(jobs, function(job) {
    out.push({
      page: 'jobs/' + job._id,
      lastmod: job.updatedAt
    });
  });

  var profiles = Profiles.find({status:"active"}, {sort: {createdAt: -1}}).fetch();
  _.each(profiles, function(profile) {
    out.push({
      page: 'profiles/' + profile._id,
      lastmod: profile.updatedAt
    });
  });
  return out;
});
