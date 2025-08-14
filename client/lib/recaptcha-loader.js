// Load reCAPTCHA v3 script on startup
Meteor.startup(() => {
  // console.log('=== reCAPTCHA Loader Starting ===');
  // console.log('Site key configured?', Meteor.settings.public?.recaptcha?.v3SiteKey);

  // Only load if we have the site key configured
  if (Meteor.settings.public?.recaptcha?.v3SiteKey) {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${Meteor.settings.public.recaptcha.v3SiteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('=== reCAPTCHA Script Loaded Successfully ===');
      // console.log('grecaptcha available?', typeof grecaptcha !== 'undefined');
    };

    script.onerror = (error) => {
      console.error('=== reCAPTCHA Script Failed to Load ===', error);
    };

    document.head.appendChild(script);
    // console.log('reCAPTCHA script tag added to page');
  } else {
    console.warn('reCAPTCHA site key not configured!');
  }
});

// Helper function to get reCAPTCHA token
window.getRecaptchaToken = function(action = 'submit_job') {
  // console.log('=== getRecaptchaToken called ===');
  // console.log('Action:', action);
  // console.log('Site key:', Meteor.settings.public?.recaptcha?.v3SiteKey);

  return new Promise((resolve, reject) => {
    // Check if reCAPTCHA is configured
    if (!Meteor.settings.public?.recaptcha?.v3SiteKey) {
      // console.error('reCAPTCHA not configured - no site key');
      reject(new Error('reCAPTCHA not configured'));
      return;
    }

    if (typeof grecaptcha === 'undefined') {
      // console.error('grecaptcha is undefined - script not loaded');
      reject(new Error('reCAPTCHA not loaded'));
      return;
    }

    // console.log('grecaptcha.ready() - waiting for reCAPTCHA to be ready...');
    grecaptcha.ready(() => {
      // console.log('grecaptcha is ready, executing...');
      grecaptcha.execute(Meteor.settings.public.recaptcha.v3SiteKey, { action })
        .then(token => {
          // console.log('Token generated successfully:', token);
          resolve(token);
        })
        .catch(error => {
          // console.error('Token generation failed:', error);
          reject(error);
        });
    });
  });
};
