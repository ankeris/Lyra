let keystone = require('keystone');
var async = require('async');


exports = module.exports = function(req, res) {
    let view = new keystone.View(req, res);
    let locals = res.locals;

    locals.section = 'products';

    locals.data = {
        products: [],
        categories: []
    };
    locals.filters = {
		category: req.params.category,
    };

	// Load all categories
	view.on('init', function (next) {
		keystone.list('ProductCategory').model.find().sort('name').exec(function (err, results) {
			if (err || !results.length) {
				return next(err);
            }

            locals.data.categories = results;

			//Load the counts for each category
			async.each(locals.data.categories, function (category, next) {
				keystone.list('Product').model.count().where('ProductType').in([category.id]).exec(function (err, count) {
                    category.postCount = count;
					next(err);
				});
			}, function (err) {
				next(err);
			});
		});
    });

    // Load the current category filter
    view.on('init', function (next) {
    		if (req.params.category) {
			keystone.list('ProductCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
                locals.data.category = result;
				next(err);
			});
		} else {
			next();
		}
    });

    // Load the products
    // view.query('products', keystone.list('Product').model.find());
    view.on('init', function (next) {
		var q = keystone.list('Product').paginate({
			page: req.query.page || 1,
			perPage: 9,
			maxPages: 10,
		}).populate('ProductType Manufacturer').sort('Manufacturer')

		if (locals.data.category) {
			q.where('ProductType').in([locals.data.category]);
        }

        if(req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            q.find({slug: regex}, function(err, results){
                if(err){
                    alert(err);
                } else {
                    locals.data.products.results = results;
                    next(err);
                }
            })
        } else {
            q.exec(function (err, results) {
                locals.data.products = results;
                next(err);
            });
        }
	});

	// Render the view
	view.render('products');
};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};