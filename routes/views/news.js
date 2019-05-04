const keystone = require('keystone');
const {loadAll} = require('../redis-queries/redisQueries');
const {cropCloudlinaryImage, isWebP} = require('../helpers');

exports = module.exports = function(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;
	const supportWebP = isWebP(req);
	locals.section = 'Naujienos';

	locals.data = {
		news: []
	};

	view.on('init', function(next) {
		const loadAllNewsQuery = {
			dbCollection: keystone.list('News'),
			sort: 'createdAt',
			redisKeyName: 'all-news',
			callback: (result, err) => {
				result.forEach((post, index) => {
					if (post.hasOwnProperty('image') && post.image.hasOwnProperty('secure_url')) {
						post.image.secure_url = cropCloudlinaryImage(post.image, 1000, 1000, supportWebP);
					}
					if (post.hasOwnProperty('hidden')) {
						if (post.hidden) {
							result.splice(index, 1);
						}
					}
				});

				locals.news = result;
				if (err || !result.length) {
					return next(err);
				}
				next();
			}
		};

		loadAll(loadAllNewsQuery);
	});
	// Render the view
	view.render('news');
};
