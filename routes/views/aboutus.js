const keystone = require('keystone');
const { loadAll } = require('../redis-queries/redisQueries');
const { cropCloudlinaryImage, isWebP } = require('../helpers');

exports = module.exports = function (req, res) {
	const supportWebP = isWebP(req);
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'Apie Lyra';
	locals.data = {
		paragraphs: [],
		manufacturers: []
	};

	view.on('init', function (next) {
		const loadAllParagraphs = {
			dbCollection: keystone.list('AboutUsParagraphs'),
			sort: 'name',
			redisKeyName: 'all-aboutusparagraphs',
			callback: (result, err) => {
				result.forEach(paragraph => {
					paragraph.images.forEach(image => {
						image.secure_url = cropCloudlinaryImage(image, 1250, 1250, supportWebP);
					});
				});
				locals.data.paragraphs = result;
				if (err || !result.length) {
					return next(err);
				}
				next();
			}
		};
		loadAll(loadAllParagraphs);
	});
	
	view.on('init', function (next) {
		const loadAllManufacturersQuery = {
			dbCollection: keystone.list('ProductManufacturer'),
			sort: 'Priority',
			redisKeyName: 'all-brands',
			callback: (result, err) => {
				result.forEach(
					manufacturer => (manufacturer.LogoWhite ? manufacturer.LogoWhite.secure_url = cropCloudlinaryImage(manufacturer.LogoWhite, 250, 250, supportWebP) : manufacturer)
				);
				locals.manufacturers = result;
				if (err || !result.length) {
					return next(err);
				}
				next();
			}
		};

		loadAll(loadAllManufacturersQuery);
	});

	// Render the view
	view.render('aboutus');
};
