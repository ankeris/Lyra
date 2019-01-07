var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.section = 'home';

	// Render the view
	view.query('manufacturers', keystone.list('ProductManufacturer').model.find());
	view.query(
		'products',
		keystone
			.list('Product')
			.model.find({
				Highlight: true
			})
			.sort('publishedDate')
			.populate('Manufacturer ProductType')
	);

	view.render('index');
};
