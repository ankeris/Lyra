let keystone = require('keystone');

exports = module.exports = function(req, res) {
    let view = new keystone.View(req, res);
    let locals = res.locals;

    locals.section = 'store';

    locals.data = {
        categories: []
    };

    // Load the products
    view.query('products', keystone.list('Product').model.find());
	// Load all categories
	view.on('init', function (next) {

		keystone.list('ProductCategory').model.find().sort('name').exec(function (err, results) {

			if (err || !results.length) {
				console.log('bye');
			}
            console.log(results);
            locals.data.categories = results;
            next();

			// Load the counts for each category
			// async.each(locals.data.categories, function (category, next) {

			// 	keystone.list('Product').model.count().where('categories').in([category.id]).exec(function (err, count) {
			// 		category.postCount = count;
			// 		next(err);
			// 	});

			// }, function (err) {
			// 	next(err);
			// });
		});
    });

    // view.on('init', function (next) {
    // 		if (req.params.category) {
    //         console.log('hi');
	// 		keystone.list('ProductCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
	// 			locals.data.categories = result;
	// 			next(err);
	// 		});
	// 	} else {
    //         console.log('bye');
	// 		next();
	// 	}
    // });

	// Render the view
	view.render('products');
};
