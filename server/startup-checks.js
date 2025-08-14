// Server startup checks
Meteor.startup(() => {
  // Check for required reCAPTCHA configuration
  if (!Meteor.settings.private?.recaptcha?.v3SecretKey) {
    console.error('');
    console.error('========================================');
    console.error('ERROR: reCAPTCHA v3 Secret Key is missing!');
    console.error('');
    console.error('Please add the following to your settings.json:');
    console.error('{');
    console.error('  "private": {');
    console.error('    "recaptcha": {');
    console.error('      "v3SecretKey": "YOUR_SECRET_KEY_HERE",');
    console.error('      "scoreThreshold": 0.5');
    console.error('    }');
    console.error('  }');
    console.error('}');
    console.error('========================================');
    console.error('');
    throw new Error('reCAPTCHA v3 Secret Key is required but not configured in settings.json');
  }
  
  if (!Meteor.settings.public?.recaptcha?.v3SiteKey) {
    console.error('');
    console.error('========================================');
    console.error('ERROR: reCAPTCHA v3 Site Key is missing!');
    console.error('');
    console.error('Please add the following to your settings.json:');
    console.error('{');
    console.error('  "public": {');
    console.error('    "recaptcha": {');
    console.error('      "v3SiteKey": "YOUR_SITE_KEY_HERE"');
    console.error('    }');
    console.error('  }');
    console.error('}');
    console.error('========================================');
    console.error('');
    throw new Error('reCAPTCHA v3 Site Key is required but not configured in settings.json');
  }
  
  // Log successful configuration
  console.log('✓ reCAPTCHA v3 configured successfully');
  console.log('  - Score threshold:', Meteor.settings.private.recaptcha.scoreThreshold || 0.5);
});