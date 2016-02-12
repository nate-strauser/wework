if (Meteor.settings && Meteor.settings.stripe && Meteor.settings.stripe.secretKey) {
    Stripe = StripeSync(Meteor.settings.stripe.secretKey);
}else{
	console.log('ERROR - Stripe API Key Not Found');
}