var keystone = require('keystone');
const redisQueries = require('../redis-queries/redisQueries');
const loadAll = redisQueries.loadAll;

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.manufacturers = [];
	locals.section = 'brands';

	view.on('init', function(next) {
		const loadAllManufacturersQuery = {
			dbCollection: keystone.list('ProductManufacturer'),
			sort: 'name',
			redisKeyName: 'allManufacturers',
			callback: (result, err) => {
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
