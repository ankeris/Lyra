var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
    locals.section = 'home';

    view.query('manufacturers', keystone.list('ProductManufacturer').model.find());
    view.query('products', keystone.list('Product').model.find({Highlight: true}).sort('publishedDate').limit(4).populate('Manufacturer'));
	// Render the view
	view.render('index');
};
