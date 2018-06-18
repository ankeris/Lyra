var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.data = {
        products: [],
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
        keystone.list('ProductCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
            locals.data.category = result;
            console.log(result);
            next(err);
        });
        } else {
            next();
        }
    });

    view.on('init', function (next) {
		let r = keystone.list('Product').model.find()
            .populate('Manufacturer ProductType')

            r.where('Manufacturer').in([locals.data.brand]).exec(function (err, result) {
		    	locals.data.products = result;
                next(err);
            });

        if (locals.data.category) {
            r.where('ProductType').in([locals.data.category]).exec(function (err, result) {
                locals.data.products = result;
                console.log(result);
                next(err);
            });
        }
    });
    
    // q.populate('Manufacturer ProductType').sort(getSort());

	// Render the view
	view.render('brand');
};
