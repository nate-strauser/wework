if (Meteor.settings && Meteor.settings.Stripe && Meteor.settings.Stripe.secretKey) {
  Stripe = StripeSync(Meteor.settings.Stripe.secretKey);
} else {
  console.log('ERROR - Stripe API Key Not Found');
}
