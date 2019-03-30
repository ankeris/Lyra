const keystone = require('keystone');
// redis
const {findItemBySlug, findOneByKey, loadAll} = require('../redis-queries/redisQueries');

// helpers
const {getSort, getRidOfMetadata} = require('../helpers');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'Pasiūlymai';

	locals.data = {
		products: [],
		categories: [],
		discounts: true,
		sort: req.query.filterlist
	};

	locals.filters = {
		categoriesWithDiscount: [],
		category: req.params.category
	};

	view.on('init', function(next) {
		const loadAllManufacturersQuery = {
			dbCollection: keystone.list('ProductManufacturer'),
			sort: 'name',
			redisKeyName: 'all-manufacturers',
			callback: (result, err) => {
				locals.data.manufacturers = result;
				if (err || !result.length) {
					return next(err);
				}
			}
		};

		const loadAllCategoriesQuery = {
			dbCollection: keystone.list('ProductCategory'),
			redisKeyName: 'all-categories',
			populateBy: 'ChildCategoryOf',
			callback: (result, err) => {
				if (err || !result.length) {
					return next(err);
				}
				const filteredArr = result.filter(cat => cat.discount || cat.discount > 0);
				locals.filters.categoriesWithDiscount = filteredArr;
				locals.data.categories = filteredArr;
				next();
			}
		};

		loadAll(loadAllManufacturersQuery);
		loadAll(loadAllCategoriesQuery);
	});

	view.on('init', function(next) {
		if (locals.filters.category) {
			let categoryQueryOptions = {
				dbCollection: keystone.list('ProductCategory'),
				keyName: locals.filters.category,
				sort: 'name',
				prefix: 'category-',
				callback: (result, err) => {
					if (err) throw console.log(err);
					else locals.data.category = result;
					next();
				}
			};
			findOneByKey(categoryQueryOptions);
		} else {
			next();
		}
	});

	// Load products
	view.on('init', function(next) {
		let productsQuery = keystone
			.list('Product')
			.paginate({
				page: req.query.page || 1,
				perPage: 9,
				maxPages: 10
			})
			.populate('Manufacturer ProductType');

		if (locals.data.category) {
			// Load the current category Object
			// Load products for basic categories (without subcategories)
			if (!locals.data.category.IsParentCategory) {
				productsQuery
					.find({
						ProductType: locals.data.category
					})
					.sort(getSort(req.query.filterlist))
					.exec(function(err, result) {
						if (err) {
							next(err);
						} else {
							locals.data.products = getRidOfMetadata(result, true, 300, 300);
							next(err);
						}
					});
			} // Load products of all children categories of parent category
			else if (locals.data.category.IsParentCategory) {
				keystone
					.list('ProductCategory')
					.model.find({$or: [{ChildCategoryOf: locals.data.category}, {_id: locals.data.category}]})
					.exec(function(err, result) {
						productsQuery
							.find({
								ProductType: {$in: result}
							})
							.exec(function(err, result) {
								if (err) {
									next(err);
								} else {
									locals.data.products = getRidOfMetadata(result, true, 300, 300);
									locals.data.products = locals.data.products.filter(product => product.Discount);
									next(err);
								}
							});
					});
			}
		} else {
			// All products with discounts
			productsQuery
				.find({$or: [{Discount: {$gt: 0}}, {ProductType: {$in: locals.filters.categoriesWithDiscount}}]})
				.sort(getSort(req.query.filterlist))
				.exec(function(err, prods) {
					if (err) {
						next(err);
					} else {
						locals.data.products = getRidOfMetadata(prods, true, 300, 300);
					}
					next(err);
				});
		}
	});
	// Render the view
	view.render('specialoffers');
};
