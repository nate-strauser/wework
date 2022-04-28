Meteor.methods({
  'notifyAdminNewJobPost'(jobId) {
    check(jobId, String);

    this.unblock();

    var admin = Users.findOne({ roles: "admin" });
    var job = Jobs.findOne(jobId);

    if (!job)
      throw new Meteor.Error("Could not find job");

    Email.send({
      to: getUserEmail(admin),
      from: FROM_EMAIL,
      subject: "New Job Posted - " + job.title,
      text: "Job needs to be approved before it is live:\n\n" + Meteor.absoluteUrl("jobs/" + job._id) + "\n\n\n\n\n\n Posted by user:" + this.userId
    });
  }
});
