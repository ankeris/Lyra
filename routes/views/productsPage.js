const keystone = require('keystone');

exports = module.exports = function(req, res) {
	const view = new keystone.View(req, res);
	let locals = res.locals;

	locals.intro = 'hahahaHohoho';
	
	// Render the view
	view.render('products');
};