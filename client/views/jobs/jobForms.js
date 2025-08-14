// Custom submit handler for reCAPTCHA v3 on job creation
AutoForm.addHooks(['jobNew'], {
  onSubmit: function(doc) {
    // console.log('=== JobNew onSubmit triggered ===');
    // console.log('Document:', doc);
    const self = this;

    // Show loading state
    $('#submitJobBtn').prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Processing...');

    // console.log('Attempting to get reCAPTCHA token...');
    // console.log('getRecaptchaToken available?', typeof getRecaptchaToken);

    // Get reCAPTCHA token
    getRecaptchaToken('submit_job')
      .then(token => {
        // console.log('reCAPTCHA token received:', token);
        // console.log('Token type:', typeof token);
        // console.log('Token length:', token ? token.length : 'null/undefined');

        // Call method with token
        // console.log('Calling Meteor method jobs.create with:', { doc, token });
        Meteor.call('jobs.create', doc, token, (error, result) => {
          // Reset button
          $('#submitJobBtn').prop('disabled', false).html('<i class="fa fa-chevron-right"></i> Continue to preview your post');

          if (error) {
            // Handle errors
            if (error.error === 'spam-detected') {
              alert('Your submission was flagged as potential spam. Please ensure you are not using a VPN or proxy, and try again.');
            } else if (error.error === 'recaptcha-failed') {
              alert('Security verification failed. Please refresh the page and try again.');
            } else if (error.error === 'config-missing') {
              alert('reCAPTCHA is not configured. Please contact the administrator.');
            } else {
              alert('An error occurred: ' + error.reason);
            }
            console.error('Job submission error:', error);
            self.done(error);
          } else {
            // Success - redirect to job page
            self.done();
            Router.go('job', { _id: result });
          }
        });
      })
      .catch(error => {
        console.error('=== reCAPTCHA Token Generation Failed ===');
        console.error('Error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        // Reset button
        $('#submitJobBtn').prop('disabled', false).html('<i class="fa fa-chevron-right"></i> Continue to preview your post');

        alert('Security verification could not be loaded. Please refresh the page and try again.');
        self.done(error);
      });

    // Prevent default form submission
    return false;
  }
});

// Keep existing hook for job edit
AutoForm.addHooks(['jobEdit'], {
  after: {
    update: function(error, result) {
      if (error) {
        console.log("Update Error:", error);
      } else {
        // analytics.track("Job Edited");
        Router.go('job', { _id: Router.current().params._id });
      }
    }
  }
});

Template.jobEdit.events({
  'click #cancel': function(event, template) {
    event.preventDefault();
    Router.go("job", { _id: this.job._id });
  }
})


