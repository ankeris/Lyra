const keystone = require('keystone');
const Enquiry = keystone.list('Enquiry');
const { isWebP, cropCloudlinaryImage } = require('../helpers');
const { findOneByKey } = require('../redis-queries/redisQueries');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	let locals = res.locals;

	// Set locals
	locals.supportWebP = isWebP(req);
	locals.section = 'contact';
	locals.data = {
		description: '',
		images: []
	},
		locals.validationErrors = {};
	locals.formData = req.body || {};
	locals.enquirySubmitted = false;
	
	// Images and text
	// Get text for "Contacts" page
	view.on('init', function (next) {
		findOneByKey({
			dbCollection: keystone.list('Texts'),
			keyName: 'contact-page-text',
			callback: (result, err) => {
				locals.data.description = result.Text;
				next(err);
			}
		});
	});

	// Get Images for "Contacts" page
	view.on('init', function (next) {
		findOneByKey({
			dbCollection: keystone.list('Images'),
			keyName: 'contact-page-switching-images',
			callback: (result, err) => {
				const images = result.Images.map(image => cropCloudlinaryImage(image, 1000, 1000, locals.supportWebP));
				locals.data.images = images;
				next(err);
			}
		});
	});

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'contact' }, function (next) {

		var newEnquiry = new Enquiry.model();
		var updater = newEnquiry.getUpdateHandler(req);

		// console.log(locals.formData);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, message',
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

	view.render('contact');
};