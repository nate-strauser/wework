// Initialize form load time
Template.jobNew.onRendered(function() {
  document.getElementById('formLoadTime').value = Date.now();
});

AutoForm.addHooks(['jobNew', 'jobEdit'], {
  before: {
    insert: function(doc) {
      const self = this;
      
      // Get anti-spam field values
      const honeypot = document.getElementById('website')?.value || '';
      const formLoadTime = parseInt(document.getElementById('formLoadTime')?.value || '0');
      
      // Quick client-side validation (optional, for better UX)
      if (honeypot) {
        alert('Please check your form and try again.');
        return false; // Cancel synchronously
      }
      
      const timeToSubmit = (Date.now() - formLoadTime) / 1000;
      if (timeToSubmit < 5) {
        alert('Please take more time to fill out the form.');
        return false; // Cancel synchronously
      }
      
      // Server-side validation (async)
      Meteor.call('validateJobSubmission', {
        honeypot: honeypot,
        formLoadTime: formLoadTime,
        clientAddress: window.location.hostname // for logging
      }, function(error, validationResult) {
        if (error) {
          console.error('Validation error:', error);
          alert('Unable to validate submission. Please try again.');
          self.result(false); // Cancel async
        } else if (!validationResult.isValid) {
          // Spam detected
          console.log('Submission blocked:', validationResult.reason);
          
          // Generic message to not tip off bots
          alert('Your submission could not be processed. Please try again later.');
          self.result(false); // Cancel async
        } else {
          // Valid submission - proceed with insert
          self.result(doc); // Continue async
        }
      });
      
      // Return undefined to indicate async operation
      return undefined;
    },
    
    update: function(doc) {
      // Updates don't need spam check (user already authenticated)
      return doc;
    }
  },
  after: {
    insert: function(error, result) {
      console.log('insert hoook')
      if (error) {
        console.log("Insert Error:", error);
      } else {
        // Only reached for validated submissions
        // analytics.track("Job Created");
        Meteor.call("notifyAdminNewJobPost", result);
        Router.go('job', { _id: result });
      }
    },
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


