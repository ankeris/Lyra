const keystone = require('keystone');
// redis
const {loadAll, findOneByKey} = require('../redis-queries/redisQueries');

// helpers
const {getSort, isWebP, getRidOfMetadata, cropCloudlinaryImage} = require('../helpers');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	const supportWebP = isWebP(req);

	locals.section = 'Nuolaidos';
	locals.supportWebP = supportWebP;

	locals.data = {
		products: [],
		discounts: true,
		sort: req.query.filterlist
	};
	locals.filters = {
		categoriesWithDiscount: []
	};

	// Find categories that have Discount on them
	view.on('init', function(next) {
		const loadAllCategoriesQuery = {
			dbCollection: keystone.list('ProductCategory'),
			redisKeyName: 'all-categories',
			populateBy: 'ChildCategoryOf',
			callback: (result, err) => {
				if (err || !result.length) {
					return next(err);
				}
				locals.filters.categoriesWithDiscount = result.filter(cat => cat.discount || cat.discount > 0);
				next();
			}
		};
		loadAll(loadAllCategoriesQuery);
	});

	view.on('init', function(next) {
		findOneByKey({
			dbCollection: keystone.list('Texts'),
			keyName: 'special-offers-main-text',
			callback: ({Text}, err) => {
				locals.specialOffersMainText = Text;
				next(err);
			}
		});
	});

	view.on('init', function(next) {
		findOneByKey({
			dbCollection: keystone.list('Images'),
			keyName: 'special-offers-main-image',
			callback: ({Image}, err) => {
				locals.specialOffersMainImage = cropCloudlinaryImage(Image, 1600, 1600, supportWebP);
				next(err);
			}
		});
	});

	// Load products
	view.on('init', function(next) {
		let productsQuery = keystone
			.list('Product')
			.paginate({
				page: req.query.page || 1,
				perPage: 12,
				maxPages: 10
			})
			.populate('Manufacturer ProductType');

		// All products with discounts
		productsQuery
			.find({$or: [{Discount: {$gt: 0}}, {ProductType: {$in: locals.filters.categoriesWithDiscount}}]})
			.sort(getSort(req.query.filterlist))
			.exec(function(err, prods) {
				if (err) {
					next(err);
				} else {
					locals.data.products = getRidOfMetadata(prods, true, 300, 300, supportWebP);
				}
				next(err);
			});
	});

	// Render the view
	view.render('specialoffers');
};
