const keystone = require('keystone');
const helpers = require('../helpers');
const cropCloudlinaryImage = helpers.cropCloudlinaryImage;
const setDiscountedPrice = helpers.setDiscountedPrice;

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

		q.exec(function(err, product) {
			if (product) {
				product.images.forEach(img => {
					locals.data.productImages.push({
						src: img.secure_url,
						w: img.width,
						h: img.height
					});
				});
				product.images.forEach(img => {
					locals.data.productImages.push({
						src: img.secure_url,
						w: img.width,
						h: img.height
					});
				});

				if (product.awards.length > 0) {
					product.awards.forEach(award => (award.CoverImage.secure_url = cropCloudlinaryImage(award.CoverImage, 150, 150)));
				}
				// Check if product doesn't have it's own discount and only then put the discount from productType
				if (!product.Discount) {
					if (product.ProductType[0].discount > 0) {
						const discount = setDiscountedPrice(product.ProductType[0].discount, product.price);
						product.Discount = discount;
					}
				}

				locals.data.product = product;
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
