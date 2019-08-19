const keystone = require('keystone');
// redis
const {findItemBySlug, findOneByKey} = require('../redis-queries/redisQueries');
// helpers
const {changeFormatToWebp, setDiscountedPrice, cropCloudlinaryImage, isWebP, getRidOfMetadata} = require('../helpers');

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
		const productQueryOptions = {
			dbCollection: keystone.list('Product'),
			populateBy: 'Manufacturer ProductType awards exteriorTrims',
			slug: locals.filters.product,
			prefix: 'product-',
			callback: (product, err) => exec(product, err)
		};

		let categoryQueryOptions = {
			dbCollection: keystone.list('ProductCategory'),
			keyName: locals.filters.category,
			prefix: 'category-',
			callback: (result, err) => {
				if (err) throw err;
				else locals.data.category = result;
			}
		};
		findOneByKey(categoryQueryOptions);
		findItemBySlug(productQueryOptions);

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

				if (product.exteriorTrims.length > 0) {
					product.exteriorTrims.forEach(exteriorTrim => (exteriorTrim.image.secure_url = cropCloudlinaryImage(exteriorTrim.image, 100, 100, supportWebP)));
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
			.lean()
			.where('ProductType')
			.in([locals.data.category])
			.where('slug')
			.ne([locals.filters.product])
			// .where('price').gt(locals.data.product.price-500).lt(locals.data.product.price+500)
			.populate('Manufacturer ProductType')
			.exec(function(err, result) {
				locals.data.relatedproducts = getRidOfMetadata(result, true, 250, 250, supportWebP);
				next(err);
			});
	});
	// Render the view
	view.render('product');
};
