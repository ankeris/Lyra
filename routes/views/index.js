var keystone = require('keystone');

// redis
const {homePageHighlights} = require('../redis-queries/redisQueries');

//helpers
const {isWebP, getRidOfMetadata} = require('../helpers');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	const supportWebP = isWebP(req);
	locals.section = 'home';
	locals.products = [];

	view.on('init', function(next) {
		const highlightQueryOptions = {
			dbCollection: keystone.list('Product'),
			populateBy: 'Manufacturer ProductType',
			sort: 'publishedDate',
			callback: (hlts, err) => {
				locals.products = getRidOfMetadata(hlts, true, 300, 300, supportWebP);
				next();
			}
		};

		homePageHighlights(highlightQueryOptions);
	});

	view.render('index');
};
