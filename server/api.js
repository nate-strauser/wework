// API must be configured and built after startup!
Meteor.startup(function() {

  // Global configuration
  var Api = new Restivus();

  Api.addRoute('jobs', {
    get: function() {
      return {
        status: "success",
        data: Jobs.find({
          createdAt: {
            $gte: daysUntilExpiration()
          },
          status: "active"
        }, {
          sort: {
            createdAt: -1
          },
          fields: {
            userId: false,
            userName: false
          },
          transform: function(doc) {
            doc.siteUrl = Meteor.absoluteUrl("jobs/" + doc._id + "/" + getSlug(doc.title));
            return doc;
          }
        }).fetch()
      };
    }
  });

  Api.addRoute('featuredJobs', {
    get: function() {
      return {
        status: "success",
        data: Jobs.find({
          featuredThrough: {
            $gte: new Date()
          },
          createdAt: {
            $gte: daysUntilExpiration()
          },
          status: "active"
        }, {
          sort: {
            createdAt: -1
          },
          fields: {
            userId: false,
            userName: false
          },
          transform: function(doc) {
            doc.siteUrl = Meteor.absoluteUrl("jobs/" + doc._id + "/" + getSlug(doc.title));
            return doc;
          }
        }).fetch()
      };
    }
  });

  Api.addRoute('profiles', {
    get: function() {
      return {
        status: "success",
        data: Profiles.find({
          status: "active"
        }, {
          sort: {
            createdAt: -1
          },
          fields: {
            userId: false,
            userName: false
          },
          transform: function(doc) {
            doc.siteUrl = Meteor.absoluteUrl("profiles/" + doc._id + "/" + getSlug((doc.name || doc.userName) + " " + doc.title));
            return doc;
          }
        }).fetch()
      };
    }
  });
});
