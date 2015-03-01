// API must be configured and built after startup!
Meteor.startup(function() {

  // Global configuration
  Restivus.configure({
    useAuth: false,
    prettyJson: true
  });

  Restivus.addRoute('jobs', {
    get: function() {
      return {
        status: "success",
        data: Jobs.find({
          $or: [{
            "createdAt": {
              $gte: daysUntilExpiration()
            }
          }, {
            "updatedAt": {
              $gte: daysUntilExpiration()
            }
          }]
        }, {
          sort: {
            createdAt: -1
          },
          fields:{
            userId:false,
            userName:false
          },
          transform:function(doc){
            doc.siteUrl = Meteor.absoluteUrl("jobs/"+doc._id);
            return doc;
          }
        }).fetch()
      };
    }
  });

  Restivus.addRoute('profiles', {
    get: function() {
      return {
        status: "success",
        data: Experts.find({}, {
          sort: {
            createdAt: -1
          },
          fields:{
            userId:false,
            userName:false
          },
          transform:function(doc){
            doc.siteUrl = Meteor.absoluteUrl("experts/"+doc._id);
            return doc;
          }
        }).fetch()
      };
    }
  });
});
