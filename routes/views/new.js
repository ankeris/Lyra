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
		newsItem: {},
		paragraphs: []
	};

	view.on('init', function(next) {
		const newsItemQueryOptions = {
			dbCollection: keystone.list('News'),
			slug: locals.filters.newsItem,
			prefix: 'news-',
			callback: (newsItem, err) => exec(newsItem, err)
		};

		findItemBySlug(newsItemQueryOptions);

		const exec = (newsItem, err) => {
			if (newsItem) {
				console.log(newsItem._id);
				locals.data.newsItem = newsItem;
				next();
			} else {
				next(err);
				throw err;
			}
		};
	});

	view.on('init', function(next) {
		keystone
			.list('NewsParagraph')
			.model.find({
				BelongsTo: locals.data.newsItem._id
			})
			.lean()
			.exec(function(err, result) {
				result.forEach(paragraph =>
					paragraph.images.forEach(image => {
						image.secure_url = cropCloudlinaryImage(image, 1250, 1250, supportWebP);
					})
				);
				locals.data.paragraphs = result;
				next(err);
			});
	});

	// Render the view
	view.render('new');
};
