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
		awards: [],
		product: null,
		dynamicLinkArr: []
	};

	view.on('init', function(next) {
		const productQueryOptions = {
			dbCollection: keystone.list('Product'),
			populateBy: [
				{
					path: 'Manufacturer'
				},
				{
					path: 'ProductType'
				},
				{
					path: 'awards'
				},
				{
					path: 'exteriorTrims'
				},
				{
					path: 'RelatedProducts',
					populate: [
						{
							path: 'Manufacturer', 
						},
						{
							path: 'ProductType', 
						},
					]
				}],
			slug: locals.filters.product,
			prefix: 'product-',
			callback: (product, err) => exec(product, err)
		};

		const categoryQueryOptions = {
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

				if (product.awards && product.awards.length > 0) {
					product.awards.forEach(award => (award.CoverImage.secure_url = cropCloudlinaryImage(award.CoverImage, 150, 150, supportWebP)));
				}

				if (product.exteriorTrims && product.exteriorTrims.length > 0) {
					product.exteriorTrims.forEach(exteriorTrim => (exteriorTrim.image.secure_url = cropCloudlinaryImage(exteriorTrim.image, 100, 100, supportWebP)));
				}
				// Add selected
				if (product.RelatedProducts && product.RelatedProducts.length) {
					locals.data.relatedproducts = [...locals.data.relatedproducts, ...product.RelatedProducts];
				}

				// Check if product doesn't have it's own discount and only then put the discount from productType
				if (!product.Discount) {
					if (product.ProductType[0].discount > 0) {
						const discount = setDiscountedPrice(product.ProductType[0].discount, product.price);
						product.Discount = discount;
					}
				}
				locals.data.product = product;
				locals.data.dynamicLinkArr = [
					{
						name: 'produktai',
						url: '/produktai/'
					},
					locals.data.category && locals.data.category.ChildCategoryOf ? {
						name: locals.data.category.ChildCategoryOf.name,
						url: '/produktai/' + locals.data.category.ChildCategoryOf.key
					} : null,
					{
						name: product.ProductType[0].name,
						url: '/produktai/' + product.ProductType[0].key
					},
					{
						name: product.title,
						url: ''
					}
				];
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
				locals.data.relatedproducts = [...locals.data.relatedproducts, ...getRidOfMetadata(result, true, 250, 250, supportWebP)];
				next(err);
			});
	});
	// Render the view
	view.render('product');
};
