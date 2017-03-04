Meteor.methods({
  sendJobInterestEmail: function(job) {
    var userName = getUserName(Users.findOne({
      _id: this.userId
    }));

    var jobOwnerEmail = getUserEmail(Users.findOne({
      _id: job.userId
    }));

    var profile = Profiles.findOne({
      userId: this.userId
    });

    Email.send({
      to: jobOwnerEmail,
      from: FROM_EMAIL,
      subject: userName + " is interested in your job posting!",
      text: userName + " is interested in your job posting at:\n\n" + Meteor.absoluteUrl("jobs/" + job._id) +
        "\n\nCheck out their profile at:\n\n" + Meteor.absoluteUrl("profiles/" + profile._id)
    });
  }

})
