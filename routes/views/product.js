const keystone = require('keystone');
const helpers = require('../helpers');
const cropCloudlinaryImage = helpers.cropCloudlinaryImage;

exports = module.exports = function(req, res) {
	let view = new keystone.View(req, res);
	let locals = res.locals;

	locals.section = 'product';
	locals.filters = {
		product: req.params.product,
		category: req.params.category
	};
	locals.data = {
		productImages: [],
		products: [],
		relatedproducts: [],
		awards: []
	};

	view.on('init', function(next) {
		let q = keystone
			.list('Product')
			.model.findOne({
				slug: locals.filters.product
			})
			.populate('Manufacturer ProductType awards');

		q.exec(function(err, result) {
			if (result) {
				result.images.forEach(img => {
					locals.data.productImages.push({
						src: img.secure_url,
						w: img.width,
						h: img.height
					});
				});
				result.images.forEach(img => {
					locals.data.productImages.push({
						src: img.secure_url,
						w: img.width,
						h: img.height
					});
				});
				if (result.awards.length > 0) {
					result.awards.forEach(award => (award.CoverImage.secure_url = cropCloudlinaryImage(award.CoverImage, 150, 150)));
				}

				locals.data.product = result;
				next(err);
			} else {
				throw err;
			}
		});
	});

	view.on('init', function(next) {
		keystone
			.list('ProductCategory')
			.model.findOne({
				key: locals.filters.category
			})
			.exec(function(err, result) {
				locals.data.category = result;
				next(err);
			});
	});

	// Related products
	view.on('init', function(next) {
		keystone
			.list('Product')
			.model.find()
			.where('ProductType')
			.in([locals.data.category])
			.where('slug')
			.ne([locals.filters.product])
			// .where('price').gt(locals.data.product.price-500).lt(locals.data.product.price+500)
			.populate('Manufacturer ProductType')
			.exec(function(err, result) {
				locals.data.relatedproducts = result;
				next(err);
			});
	});
	// Render the view
	view.render('product');
};
