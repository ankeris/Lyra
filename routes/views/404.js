const keystone = require('keystone');

exports = module.exports = function (req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.section = 'Toks puslapis neegzistuoja';
	locals.data = {};

	// Render the view
	view.render('errors/404');
};
