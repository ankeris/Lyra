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

	// Load all categories for side navigation
	view.on('init', function(next) {
		keystone
			.list('ProductCategory')
			.model.find()
			.sort('name')
			.exec(function(err, result) {
				const filteredArr = result.filter(cat => cat.discount || cat.discount > 0);
				locals.filters.categoriesWithDiscount = filteredArr;
				locals.data.categories = result;
				next(err);
			});
	});

	// Load products
	view.on('init', function(next) {
		let r = keystone
			.list('Product')
			.model.find({Discount: {$gt: 0}})
			.populate('Manufacturer ProductType')
			.sort(getSort(req.query.filterlist))
			.exec(function(err, prods) {
				if (err) {
					next(err);
				} else {
					locals.data.products = prods;
				}
				next(err);
			});

		// if (!locals.data.category) {
		// 	r.exec(function(err, result) {
		// 		if (err) {
		// 			next(err);
		// 		} else {
		// 			let products = result;
		// 			let arrWithDiscounts = [];
		// 			for (let product = 0; product < products.length; product++) {
		// 				if (products[product].Manufacturer) {
		// 					for (let cat = 0; cat < locals.filters.categoriesWithDiscount.length; cat++) {
		// 						if (products[product].Manufacturer._id == locals.filters.categoriesWithDiscount[cat]._id) {
		// 							arrWithDiscounts.push(products[product]);
		// 						}
		// 					}
		// 				}
		// 			}
		// 			console.log(arrWithDiscounts);
		// 			locals.data.products = getRidOfMetadata(arrWithDiscounts, true, 300, 300);
		// 			next(err);
		// 		}
		// 	});
		// }

		// if (locals.data.category) {
		// 	// Load products for basic categories (without subcategories)
		// 	if (!locals.data.category.IsParentCategory) {
		// 		r.find({
		// 			ProductType: locals.data.category,
		// 			Manufacturer: locals.data.brand
		// 		}).exec(function(err, result) {
		// 			if (err) {
		// 				next(err);
		// 			} else {
		// 				locals.data.products = getRidOfMetadata(result, true, 300, 300);
		// 				next(err);
		// 			}
		// 		});
		// 	} // Load products of all children categories of parent category
		// 	else if (locals.data.category.IsParentCategory) {
		// 		keystone
		// 			.list('ProductCategory')
		// 			.model.find({ChildCategoryOf: locals.data.category})
		// 			.exec(function(err, result) {
		// 				r.find({
		// 					ProductType: {$in: result},
		// 					Manufacturer: locals.data.brand
		// 				}).exec(function(err, result) {
		// 					if (err) {
		// 						next(err);
		// 					} else {
		// 						locals.data.products = getRidOfMetadata(result, true, 300, 300);
		// 						next(err);
		// 					}
		// 				});
		// 			});
		// 	}
		// }
	});
	// Render the view
	view.render('specialoffers');
};
