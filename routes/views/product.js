let keystone = require('keystone');

exports = module.exports = function(req, res) {
    let view = new keystone.View(req, res);
    let locals = res.locals;

    locals.section = 'products';
    locals.filters = {
        product: req.params.product,
        category: req.params.category
    }

    locals.data = {
        products: [],
        relatedproducts: [],
    }

    view.on('init', function(next) {
        let q = keystone.list('Product').model.findOne({
            slug: locals.filters.product
        }).populate('Manufacturer');

        q.exec(function(err, result){
            locals.data.product = result;
            next(err);
        });
    });

    view.on('init', function(next){
        keystone.list('ProductCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
            locals.data.category = result;
            next(err);
        });
    });

    view.on('init', function(next){
        let r = keystone.list('Product').model
        .find()
        .where('ProductType').in([locals.data.category])
        .where('slug').ne([locals.filters.product])
        .populate('Manufacturer ProductType')
        .exec(function (err, result) {
            locals.data.relatedproducts = result;
            next(err);
        });
    });
	// Render the view
	view.render('product');
}