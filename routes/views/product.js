const keystone = require('keystone');
// redis
const redisQueries = require('../redis-queries/redisQueries');
const findProduct = redisQueries.findItemBySlug;
const findCategory = redisQueries.findOneByKey;
// helpers
const {changeFormatToWebp, setDiscountedPrice, cropCloudlinaryImage, isWebP} = require('../helpers');

exports = module.exports = function(req, res) {
	const view = new keystone.View(req, res);
	let locals = res.locals;
	const supportWebP = isWebP(req);

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
		let productQueryOptions = {
			dbCollection: keystone.list('Product'),
			populateBy: 'Manufacturer ProductType awards',
			slug: locals.filters.product,
			callback: (product, err) => exec(product, err)
		};

		let categoryQueryOptions = {
			dbCollection: keystone.list('ProductCategory'),
			keyName: locals.filters.category,
			callback: (result, err) => {
				if (err) throw console.log(err);
				else locals.data.category = result;
			}
		};
		findCategory(categoryQueryOptions);
		findProduct(productQueryOptions);

		function exec(product, err = '') {
			if (product) {
				product.images.forEach(img => {
					if (supportWebP) img.secure_url = changeFormatToWebp(img.secure_url);

					locals.data.productImages.push({
						src: img.secure_url,
						w: img.width,
						h: img.height
					});
				});

				if (product.awards.length > 0) {
					product.awards.forEach(award => (award.CoverImage.secure_url = cropCloudlinaryImage(award.CoverImage, 150, 150, supportWebP)));
				}

				// Check if product doesn't have it's own discount and only then put the discount from productType
				if (!product.Discount) {
					if (product.ProductType[0].discount > 0) {
						const discount = setDiscountedPrice(product.ProductType[0].discount, product.price);
						product.Discount = discount;
					}
				}
				locals.data.product = product;
				next();
			} else {
				throw err;
			}
		}
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
