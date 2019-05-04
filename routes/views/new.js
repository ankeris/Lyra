const keystone = require('keystone');
const {findItemBySlug} = require('../redis-queries/redisQueries');
const {cropCloudlinaryImage, isWebP} = require('../helpers');

exports = module.exports = function(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;
	const supportWebP = isWebP(req);
	locals.section = 'Naujienos';

	locals.filters = {
		newsItem: req.params.newsItem
	};

	locals.data = {
		newsItem: {}
	};

	view.on('init', function(next) {
		const newsItemQueryOptions = {
			dbCollection: keystone.list('News'),
			slug: locals.filters.newsItem,
			prefix: 'news-',
			callback: (newsItem, err) => exec(newsItem, err)
		};

		findItemBySlug(newsItemQueryOptions);

		function exec(newsItem, err = '') {
			if (newsItem) {
				locals.data.new = newsItem;
				console.log(newsItem);
				// Check if product doesn't have it's own discount and only then put the discount from productType
				next();
			} else {
				throw err;
			}
		}
	});
	// Render the view
	view.render('new');
};
