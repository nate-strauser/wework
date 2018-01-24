Meteor.methods({
  deactivateJob: function(jobId, filled) {
    check(jobId, String);
    check(filled, Boolean);

    var job = Jobs.findOne({
      _id: jobId
    });
    if (!job)
      throw new Meteor.Error("Could not find job.");

    if (this.userId !== job.userId)
      throw new Meteor.Error("You can only deactivate your own job.");

    if (job.status !== "active")
      throw new Meteor.Error("You can only deactivate an active job.");

    Jobs.update({
      _id: jobId
    }, {
      $set: {
        status: (filled ? "filled" : "inactive")
      }
    });
  },
  registerJobInterest: function(jobId) {
    check(jobId, String);

    var job = Jobs.findOne({
      _id: jobId
    });

    if (!job)
      throw new Meteor.Error("Could not find job.");

    if (job.status !== "active")
      throw new Meteor.Error("You can only show interest in an active job.");

    var userProfile = Profiles.findOne({
      userId: this.userId
    });

    if ( !userProfile )
      throw new Meteor.Error("You must have a developer profile to register interest in a job.");

    Meteor.call("sendJobInterestEmail", job);

    Users.update({
      _id: this.userId
    }, {
      $addToSet: {
        interestedInJobIds: jobId
      }
    });
  },
  adminSetJobStatus: function(jobId, status) {
    check(jobId, String);
    check(status, String);

    var job = Jobs.findOne({
      _id: jobId
    });
    if (!job)
      throw new Meteor.Error("Could not find job.");

    if (!Roles.userIsInRole(this.userId, ['admin']))
      throw new Meteor.Error("Only admins can set job status");

    var setObject = {
      status: status
    };

    if (Meteor.isServer && status === "active" && job.featured())
      setObject.featuredThrough = moment().add(30, "days").toDate();

    Jobs.update({
      _id: jobId
    }, {
      $set: setObject
    });

  },
  adminSetProfileStatus: function(profileId, status) {
    check(profileId, String);
    check(status, String);

    var job = Profiles.findOne({
      _id: profileId
    });
    if (!job)
      throw new Meteor.Error("Could not find profile.");

    if (!Roles.userIsInRole(this.userId, ['admin']))
      throw new Meteor.Error("Only admins can set profile status");

    var setObject = {
      status: status
    };


    Profiles.update({
      _id: profileId
    }, {
      $set: setObject
    });

  },
  createFeaturedJobCharge: function(tokenId, jobId) {
    check(tokenId, String);
    check(jobId, String);

    var job = Jobs.findOne({ _id: jobId });
    if (!job)
      throw new Meteor.Error("Could not find job.");

    if (job.userId !== this.userId)
      throw new Meteor.Error("You can only pay for you own job post.");


    if (Meteor.isServer) {
      var result = Stripe.charges.create({
        source: tokenId,
        amount: 10000,
        currency: "usd",
        description: "We Work Meteor - Featured Job Post - 30 Days"
      });

      if (result && (result.status === "succeeded" || result.status === "paid")) { //'paid' status is not in stripe docs, but is occuring - see https://github.com/nate-strauser/wework/issues/108
        Jobs.update({ _id: job._id }, {
          $set: {
            featuredThrough: moment().add(30, "days").toDate()
          },
          $push: {
            featuredChargeHistory: result.id
          }
        });
      } else {
        throw new Meteor.Error("Payment Failed!", "Stripe result not as expected", JSON.stringify(result));
      }
    } else {
      Jobs.update({
        _id: jobId
      }, {
        $set: {
          featuredThrough: moment().add(30, "days").toDate()
        }
      });
    }
  }
});
