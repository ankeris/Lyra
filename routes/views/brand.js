var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.data = {
        products: [],
        sort: req.query.filterlist
	}

	console.log(req.params);

	locals.filters = {
		brand: req.params.brand,
		category: req.params.category
	}

	view.query('manufacturers', keystone.list('ProductManufacturer').model.find());

	view.on('init', function (next) {
		keystone.list('ProductManufacturer').model.findOne({
			key: locals.filters.brand
		}).exec(function (err, result) {
			locals.data.brand = result;
			locals.data.name = result.name;
			next(err);
		});
	});

	// Load all categories for side navigation
	view.on('init', function (next) {
		keystone.list('ProductCategory').model.find().sort('name').exec(function (err, results) {
			if (err || !results.length) {
				return next(err);
			}

			locals.data.categories = results;
			//Load the counts for each category (counts how much products every category contains)
			async.each(locals.data.categories, function (category, next) {
				keystone.list('Product').model.count()
					.where('ProductType').in([category.id])
					.where('Manufacturer').in([locals.data.brand])
					.exec(function (err, count) {
						category.postCount = count;
						next(err);
					});
			}, function (err) {
				next(err);
			});
		});
	});

	// Load the current category Object
	view.on('init', function (next) {
		if (req.params.category) {
			keystone.list('ProductCategory').model.findOne({
				key: locals.filters.category
			}).exec(function (err, result) {
				locals.data.category = result;
				next(err);
			});
		} else {
			next();
		}
	});

	// Load products
	view.on('init', function (next) {
		let r = keystone.list('Product').paginate({
			page: req.query.page || 1,
			perPage: 9,
			maxPages: 10,
		})
		r.populate('Manufacturer ProductType').sort(getSort());

		r.where('Manufacturer').in([locals.data.brand]).exec(function (err, result) {
			locals.data.products = result;
			next(err);
		});

		function getSort() {
			if (req.query.filterlist == "price-high") {
                return { 'price': -1 };
			} else if (req.query.filterlist == "price-low") {
                return { 'price': 1 };
			}
        }

		if (locals.data.category) {
			r.where('ProductType').in([locals.data.category]).exec(function (err, result) {
				locals.data.products = result;
				// next(err);
			});
		}
	});

	// q.populate('Manufacturer ProductType').sort(getSort());

	// Render the view
	view.render('brand');
};
