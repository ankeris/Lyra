var keystone = require('keystone');
var Subscription = keystone.list('Subscription');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.subSubmitted = false;

	console.log(locals.formData);
	
	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'index' }, function (next) {

		var newSubscription = new Subscription.model();
		var subUpdater = newSubscription.getUpdateHandler(req);
		
		subUpdater.process(req.body, {
			flashErrors: true,
			fields: 'email',
			errorMessage: 'Įvyko klaida pildant formą',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.subSubmitted = true;
			}
			next();
		});
	});
	view.render('index');
};