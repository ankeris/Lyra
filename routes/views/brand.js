var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.data = {
        products: [],
    }

    console.log(req.params);
    locals.filters = {
        brand: req.params.brand
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
    view.on('init', function (next) {
		let r = keystone.list('Product').model
            .find()
            .where('Manufacturer').in([locals.data.brand])
            .populate('Manufacturer ProductType')
		    .exec(function (err, result) {
		    	locals.data.products = result;
                next(err);
		    });
    });

	// Render the view
	view.render('brand');
};
