// check, Match, and HTTP are globally available in Meteor
Meteor.methods({
  'jobs.create'(doc, recaptchaToken) {
    // console.log('=== Server: jobs.create method called ===');
    // console.log('Number of arguments received:', arguments.length);
    // console.log('Arg 0 (doc):', doc);
    // console.log('Arg 1 (recaptchaToken):', recaptchaToken);
    // console.log('recaptchaToken type:', typeof recaptchaToken);
    // console.log('recaptchaToken value:', recaptchaToken);

    // Validate input
    check(doc, {
      title: String,
      company: Match.Maybe(String),
      location: Match.Maybe(String),
      url: Match.Maybe(String),
      contact: String,
      jobtype: String,
      description: String,
      remote: Match.Maybe(Boolean)
    });

    // Development bypass - skip reCAPTCHA in development mode
    const isDevelopment = Meteor.isDevelopment;
    const bypassInDev = Meteor.settings.private?.recaptcha?.bypassInDevelopment;

    if (isDevelopment && bypassInDev) {
      console.log('⚠️ reCAPTCHA bypassed in development mode');
      // Skip all reCAPTCHA verification in development
    } else {
      // Production path - require and verify reCAPTCHA

      // Check if reCAPTCHA is configured
      if (!Meteor.settings.private?.recaptcha?.v3SecretKey) {
        throw new Meteor.Error('config-missing',
          'reCAPTCHA is not configured. Please contact the administrator.');
      }

      // reCAPTCHA token is required in production
      check(recaptchaToken, String);

      // Verify reCAPTCHA token
      const verificationResult = verifyRecaptchaV3(recaptchaToken, this.connection.clientAddress);

      if (!verificationResult.success) {
        throw new Meteor.Error('recaptcha-failed',
          verificationResult.error || 'reCAPTCHA verification failed');
      }

      const scoreThreshold = Meteor.settings.private.recaptcha.scoreThreshold || 0.5;
      if (verificationResult.score < scoreThreshold) {
        // Log suspicious activity
        console.log(`Low reCAPTCHA score: ${verificationResult.score} from IP: ${this.connection.clientAddress}`);
        throw new Meteor.Error('spam-detected',
          'Your submission was flagged as potential spam. Please try again or contact support.');
      }

      // Add reCAPTCHA score to document
      // doc.recaptchaScore = verificationResult.score;
      // doc.recaptchaAction = verificationResult.action;
    }

    // Insert job using the Jobs collection schema which will handle autoValues
    const jobId = Jobs.insert(doc);

    // Send admin notification email
    const admin = Users.findOne({ roles: "admin" });
    const job = Jobs.findOne(jobId);

    if (admin && job) {
      Email.send({
        to: getUserEmail(admin),
        from: FROM_EMAIL,
        subject: "New Job Posted - " + job.title,
        text: "Job needs to be approved before it is live:\n\n" + Meteor.absoluteUrl("jobs/" + job._id) + "\n\n\n\n\n\n Posted by user:" + this.userId
      });
    }

    return jobId;
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

// Helper function: Verify reCAPTCHA v3 token with Google
function verifyRecaptchaV3(token, remoteip) {
  try {
    const response = HTTP.post('https://www.google.com/recaptcha/api/siteverify', {
      params: {
        secret: Meteor.settings.private.recaptcha.v3SecretKey,
        response: token,
        remoteip: remoteip
      }
    });

    const data = response.data;

    // Check if verification was successful
    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      return {
        success: false,
        error: 'Verification failed: ' + (data['error-codes'] || ['unknown']).join(', ')
      };
    }

    // Verify the action name matches what we expect
    if (data.action !== 'submit_job') {
      console.error('reCAPTCHA action mismatch:', data.action);
      return {
        success: false,
        error: 'Invalid action'
      };
    }

    return {
      success: true,
      score: data.score,
      action: data.action,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname
    };

  } catch (error) {
    console.error('reCAPTCHA API error:', error);
    return {
      success: false,
      error: 'Unable to verify reCAPTCHA'
    };
  }
}
