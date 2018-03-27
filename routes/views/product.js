let keystone = require('keystone');

exports = module.exports = function(req, res) {
    let view = new keystone.View(req, res);
    let locals = res.locals;

    locals.section = 'store';
    locals.filters = {
        product: req.params.product
    }

    locals.data = {
        products: []
    }

    view.on('init', function(next) {
        let q = keystone.list('Product').model.findOne({
            slug: locals.filters.product
        });

        q.exec(function(err, result){
            locals.data.product = result;
            next(err);
        });
    });

	// Render the view
	view.render('product');
}