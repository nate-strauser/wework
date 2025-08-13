Meteor.methods({
  'validateJobSubmission'(data) {
    check(data, {
      honeypot: String,
      formLoadTime: Number,
      clientAddress: String
    });
    
    const response = {
      isValid: true,
      reason: null
    };
    
    // Check honeypot (should be empty for humans)
    if (data.honeypot && data.honeypot.length > 0) {
      // Log spam attempt
      console.log(`[SPAM BLOCKED] Honeypot triggered from ${this.connection.clientAddress}`);
      
      response.isValid = false;
      response.reason = 'honeypot_triggered';
      
      return response;
    }
    
    // Check submission timing
    const now = Date.now();
    const timeToSubmit = (now - data.formLoadTime) / 1000; // in seconds
    
    // Too fast (bot-like behavior)
    if (timeToSubmit < 5) {
      console.log(`[SPAM BLOCKED] Form submitted too quickly: ${timeToSubmit}s from ${this.connection.clientAddress}`);
      
      response.isValid = false;
      response.reason = 'submitted_too_fast';
      
      return response;
    }
    
    // Too slow (stale form, possible attack)
    if (timeToSubmit > 3600) { // 1 hour
      console.log(`[SPAM BLOCKED] Stale form submission: ${timeToSubmit}s from ${this.connection.clientAddress}`);
      
      response.isValid = false;
      response.reason = 'form_expired';
      
      return response;
    }
    
    // Valid submission
    console.log(`[VALID] Job submission validated from ${this.connection.clientAddress}`);
    return response;
  },
  
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
