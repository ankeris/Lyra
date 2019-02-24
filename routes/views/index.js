var keystone = require('keystone');
const redisQueries = require('../redis-queries/redisQueries');
const homePageHighlights = redisQueries.homePageHighlights;

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.section = 'home';
	locals.products = [];

	view.on('init', function(next) {
		const highlightQueryOptions = {
			dbCollection: keystone.list('Product'),
			populateBy: 'Manufacturer ProductType',
			sort: 'publishedDate',
			callback: (hlts, err) => {
				locals.products = hlts;
				next();
			}
		};

		homePageHighlights(highlightQueryOptions);
	});

	view.render('index');
};
