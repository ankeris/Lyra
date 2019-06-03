const keystone = require('keystone');
const { findItemBySlug } = require('../redis-queries/redisQueries');
const { getRidOfMetadata, cropCloudlinaryImage, isWebP } = require('../helpers');

exports = module.exports = function (req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;
	const supportWebP = isWebP(req);
	locals.section = 'Naujienos';

	locals.filters = {
		newsItem: req.params.newsItem,
		relatedProductIds: []
	};

	locals.data = {
		newsItem: {},
		paragraphs: [],
		relatedProducts: []
	};

	view.on('init', function (next) {
		const newsItemQueryOptions = {
			dbCollection: keystone.list('News'),
			slug: locals.filters.newsItem,
			prefix: 'news-',
			callback: (newsItem, err) => exec(newsItem, err)
		};

		findItemBySlug(newsItemQueryOptions);

		const exec = (newsItem, err) => {
			if (newsItem) {

				if (newsItem.relatedProducts && newsItem.relatedProducts.length) {
					locals.filters.relatedProductIds = newsItem.relatedProducts;
				}

				locals.data.newsItem = newsItem;
				next();
			} else {
				next(err);
				throw err;
			}
		};
	});

	view.on('init', function (next) {
		keystone
			.list('NewsParagraph')
			.model.find({
				BelongsTo: locals.data.newsItem._id
			})
			.populate('awards')
			.lean()
			.exec(function (err, result) {
				result.forEach(paragraph => {
					paragraph.images.forEach(image => {
						image.secure_url = cropCloudlinaryImage(image, 1250, 1250, supportWebP);
					});

					if (paragraph.awards && paragraph.awards.length > 0) {
						paragraph.awards.forEach(award => (award.CoverImage.secure_url = cropCloudlinaryImage(award.CoverImage, 100, 100, supportWebP)));
					}
				}
				);
				locals.data.paragraphs = result;
				next(err);
			});
	});

	view.on('init', function (next) {
		if (locals.filters.relatedProductIds.length) {
			// All products with discounts
			keystone
				.list('Product').model
				.find({ _id: { $in: locals.filters.relatedProductIds } })
				.populate('Manufacturer ProductType')
				.exec(function (err, prods) {
					if (err) {
						next(err);
					} else {
						locals.data.relatedProducts = getRidOfMetadata(prods, true, 300, 300, supportWebP);
					}
					next(err);
				});
		} else {
			next();
		}
	});

	// Render the view
	view.render('new');
};
