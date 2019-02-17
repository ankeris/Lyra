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

	// Load all categories that have discounts for side navigation
	view.on('init', function(next) {
		keystone
			.list('ProductCategory')
			.model.find()
			.sort('name')
			.exec(function(err, result) {
				const filteredArr = result.filter(cat => cat.discount || cat.discount > 0);
				locals.filters.categoriesWithDiscount = filteredArr;
				locals.data.categories = filteredArr;
				next(err);
			});
	});

	// Load products
	view.on('init', function(next) {
		let r = keystone
			.list('Product')
			.model.find({$or: [{Discount: {$gt: 0}}, {ProductType: {$in: locals.filters.categoriesWithDiscount}}]})
			.populate('Manufacturer ProductType')
			.sort(getSort(req.query.filterlist))
			.exec(function(err, prods) {
				if (err) {
					next(err);
				} else {
					locals.data.products = getRidOfMetadata(prods, true, 300, 300);
				}
				next(err);
			});
	});
	// Render the view
	view.render('specialoffers');
};
