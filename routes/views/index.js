const keystone = require('keystone');

// redis
const {homePageHighlights} = require('../redis-queries/redisQueries');

//helpers
const {isWebP, getRidOfMetadata} = require('../helpers');

exports = module.exports = function(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;
	locals.supportWebP = isWebP(req);
	locals.section = 'home';
	locals.products = [];

	view.on('init', function(next) {
		const highlightQueryOptions = {
			dbCollection: keystone.list('Product'),
			populateBy: 'Manufacturer ProductType',
			sort: 'publishedDate',
			callback: (hlts, err) => {
				if (err) throw err;
				locals.products = getRidOfMetadata(hlts, true, 300, 300, locals.supportWebP);
				next();
			}
		};

		homePageHighlights(highlightQueryOptions);
	});

	view.render('index');
};
