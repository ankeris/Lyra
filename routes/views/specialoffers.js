const keystone = require('keystone');
const helpers = require('../helpers');
const getSort = helpers.getSort;
const getRidOfMetadata = helpers.getRidOfMetadata;

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
		keystone
			.list('ProductManufacturer')
			.model.find()
			.sort('name')
			.exec(function(err, result) {
				locals.data.manufacturers = result;
				next(err);
			});
	});

	const categoryQuery = keystone.list('ProductCategory').model;

	view.on('init', function(next) {
		categoryQuery
			.find()
			.sort('name')
			.exec(function(err, result) {
				const filteredArr = result.filter(cat => cat.discount || cat.discount > 0);
				locals.filters.categoriesWithDiscount = filteredArr;
				locals.data.categories = filteredArr;
				next(err);
			});
	});
	view.on('init', function(next) {
		if (locals.filters.category) {
			categoryQuery
				.findOne({
					key: locals.filters.category
				})
				.populate('ChildCategoryOf')
				.exec(function(err, result) {
					locals.data.category = result;
					next(err);
				});
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
