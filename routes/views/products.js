let keystone = require('keystone');

exports = module.exports = function(req, res) {
    let view = new keystone.View(req, res);
    let locals = res.locals;

    locals.section = 'store';

	// Load the galleries by sortOrder
	view.query('products', keystone.list('Product').model.find());

	// Render the view
	view.render('products');

}