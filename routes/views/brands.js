var keystone = require('keystone');
const redisQueries = require('../redis-queries/redisQueries');
const {loadAll} = redisQueries;
const {cropCloudlinaryImage} = require('../helpers');
const browser = require('browser-detect');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.manufacturers = [];
	locals.section = 'brands';
	const supportWebP = browser(req.headers['user-agent']).name == 'chrome';

	view.on('init', function(next) {
		const loadAllManufacturersQuery = {
			dbCollection: keystone.list('ProductManufacturer'),
			sort: 'name',
			redisKeyName: 'all-manufacturers',
			callback: (result, err) => {
				result.forEach(
					manufacturer => (manufacturer.SmallPreviewImage.secure_url = cropCloudlinaryImage(manufacturer.SmallPreviewImage, 250, 250, supportWebP))
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
	view.render('brands');
};
