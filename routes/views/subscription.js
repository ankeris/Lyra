var keystone = require('keystone');
var Subscription = keystone.list('Enquiry');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;

	console.log(locals.formData);
	
	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'index' }, function (next) {

		var newSubscription = new Subscription.model();
		var updater = newSubscription.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'email',
			errorMessage: 'Įvyko klaida pildant formą',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});
	});
	view.render('index');
};