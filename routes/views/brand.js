var keystone = require('keystone');
var async = require('async');
const helpers = require('../helpers');
const cropCloudlinaryImage = helpers.cropCloudlinaryImage;
const getSort = helpers.getSort;
const getRidOfMetadata = helpers.getRidOfMetadata;

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.data = {
		products: [],
		sort: req.query.filterlist
	};

	locals.filters = {
		brand: req.params.brand,
		category: req.params.category
	};

	// All manufacturers for sidenav
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

	view.on('init', function(next) {
		keystone
			.list('ProductManufacturer')
			.model.findOne({
				key: locals.filters.brand
			})
			.exec(function(err, result) {
				locals.data.brand = result;
				locals.data.name = result.name;
				next(err);
			});
	});

	// All categories for side navigation
	view.on('init', function(next) {
		keystone
			.list('ProductCategory')
			.model.find()
			.sort('name')
			.populate('ChildCategoryOf')
			.exec(function(err, results) {
				if (err || !results.length) {
					return next(err);
				}

				locals.data.allCategories = results;
				let categoriesToDisplay = [];
				//Load the counts for each category (counts how much products every category contains)
				async.each(
					locals.data.allCategories,
					function(category, next) {
						keystone
							.list('Product')
							.model.count()
							.where('ProductType')
							.in([category.id])
							.where('Manufacturer')
							.in([locals.data.brand])
							.exec(function(err, count) {
								category.postCount = count;

								if (category.postCount > 0) {
									categoriesToDisplay.push(category);
								}
								next(err);
							});
					},
					function(err) {
						categoriesToDisplay.sort();
						locals.data.categories = categoriesToDisplay;
						next(err);
					}
				);
			});
	});

	// Load the current category Object
	view.on('init', function(next) {
		if (req.params.category) {
			keystone
				.list('ProductCategory')
				.model.findOne({
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
		let r = keystone.list('Product').paginate({
			page: req.query.page || 1,
			perPage: 9,
			maxPages: 10
		});
		r.populate('Manufacturer ProductType').sort(getSort(req.query.filterlist));

		if (!locals.data.category) {
			r.find({
				Manufacturer: locals.data.brand
			}).exec(function(err, result) {
				console.log(result);

				if (err) {
					next(err);
				} else {
					locals.data.products = getRidOfMetadata(result, true, 300, 300);
					next(err);
				}
			});
		}

		if (locals.data.category) {
			// Load products for basic categories (without subcategories)
			if (!locals.data.category.IsParentCategory) {
				r.find({
					ProductType: locals.data.category,
					Manufacturer: locals.data.brand
				}).exec(function(err, result) {
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
					.model.find({ChildCategoryOf: locals.data.category})
					.exec(function(err, result) {
						r.find({
							ProductType: {$in: result},
							Manufacturer: locals.data.brand
						}).exec(function(err, result) {
							if (err) {
								next(err);
							} else {
								locals.data.products = getRidOfMetadata(result, true, 300, 300);
								next(err);
							}
						});
					});
			}
		}
	});

	// Render the view
	view.render('brand');
};
