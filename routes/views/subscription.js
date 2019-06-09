var keystone = require('keystone');
var Subscription = keystone.list('Subscription');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.status = {};
	locals.formSubmitted = false;
	locals.emailExists = false;
	locals.page = req.originalUrl;

	// On POST requests, add the Enquiry item to the database
	view.on('post', function (next) {
		const newSubscription = new Subscription.model();
		let subUpdater = newSubscription.getUpdateHandler(req);
		keystone.list('Subscription').model.find({ email: req.body.email }).exec(function (err, result) {
			if (result.length == 0) {
				subUpdater.process(req.body, {
					flashErrors: true,
					fields: 'email',
					errorMessage: 'Įvyko klaida pildant formą',
				}, function (err) {
					if (err) {
						locals.validationErrors = err.errors;
					} else {
						locals.status = { email: req.body.email };
						locals.formSubmitted = true;
					}
					next();
				});
			} else {
				locals.status = { title: 'Šis el-paštas jau yra įtrauktas į prenumetūrą', message: '' };
				locals.emailExists = true;
				next();
			}
		});
	});
	view.render('index');
};