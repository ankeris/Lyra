const keystone = require('keystone');
const {getRidOfMetadata, isWebP, getSort} = require('../helpers');

// redis
const redisQueries = require('../redis-queries/redisQueries');
const {loadAll, findOneByKey} = redisQueries;

exports = module.exports = function(req, res) {
	const view = new keystone.View(req, res);
	let locals = res.locals;
	const supportWebP = isWebP(req);

	locals.section = 'products';
	locals.supportWebP = supportWebP;
	locals.data = {
		products: [],
		categories: [],
		subcategories: [],
		sort: req.query.filterlist
	};

	locals.filters = {
		category: req.params.category,
		search: req.query.search
	};

	// Load all categories for side navigation
	view.on('init', function(next) {
		const loadAllCategoriesQuery = {
			dbCollection: keystone.list('ProductCategory'),
			sort: 'Priority',
			redisKeyName: 'all-categories',
			populateBy: 'ChildCategoryOf',
			callback: (cats, err) => {
				locals.data.categories = cats;
				if (err || !cats.length) {
					return next(err);
				}
				next();
			}
		};

		loadAll(loadAllCategoriesQuery);
	});
	// load current category
	view.on('init', next => {
		if (req.params.category) {
			findOneByKey({
				dbCollection: keystone.list('ProductCategory'),
				keyName: locals.filters.category,
				prefix: 'category-',
				callback: (result, err) => {
					if (err) throw err;
					else locals.data.category = result;
					next(err);
				}
			});
		} else {
			next();
		}
	});

	// Additionally query manufacturers for side navigation
	view.on('init', function(next) {
		const loadAllManufacturersQuery = {
			dbCollection: keystone.list('ProductManufacturer'),
			sort: 'Priority',
			redisKeyName: 'all-brands',
			callback: (result, err) => {
				locals.data.manufacturers = result;
				if (err || !result.length) {
					return next(err);
				}
				next();
			}
		};

		loadAll(loadAllManufacturersQuery);
	});
	
	// Images and text
	// Get text for "Contacts" page
	if (!locals.filters.category) {
		view.on('init', function (next) {
			findOneByKey({
				dbCollection: keystone.list('Texts'),
				keyName: 'product-catalogue-intro',
				callback: ({Text}, err) => {
					locals.data.productCatalogueIntro = Text;
					next(err);
				}
			});
		});
	
		// Get Images for "Contacts" page
		// view.on('init', function (next) {
		// });
	}

	// Load ALL products
	view.on('init', function(next) {
		let q = keystone.list('Product').paginate({
			page: req.query.page || 1,
			perPage: 9,
			maxPages: 10
		});

		q.lean()
			.populate('Manufacturer ProductType')
			.sort(getSort(req.query.filterlist));

		if (locals.data.category) {
			// Load products for basic categories (without subcategories)
			if (!locals.data.category.IsParentCategory) {
				q.find({
					ProductType: locals.data.category
				})
					.lean()
					.exec(function(err, result) {
						if (err) {
							next(err);
						} else {
							locals.data.products = getRidOfMetadata(result, true, 300, 300, supportWebP);
							next(err);
						}
					});
			} // Load products of all children categories of parent category
			else if (locals.data.category.IsParentCategory) {
				keystone
					.list('ProductCategory')
					.model.find({$or: [{ChildCategoryOf: locals.data.category}, {_id: locals.data.category}]})
					.exec(function(err, result) {
						q.find({
							ProductType: {$in: result}
						})
							.lean()
							.exec(function(err, result) {
								if (err) {
									next(err);
								} else {
									locals.data.products = getRidOfMetadata(result, true, 300, 300, supportWebP);
									next(err);
								}
							});
					});
			}
		}

		if (req.query.search) {
			const regex = new RegExp(escapeRegex(req.query.search), 'gi');
			q.find({
				$or: [
					{
						slug: regex
					},
					{
						title: regex
					}
				]
			})
				.lean()
				.exec(
					function(err, result) {
						if (err) {
							next(err);
						} else {
							locals.data.products = getRidOfMetadata(result, true, 300, 300, supportWebP);
							next(err);
						}
					} // Default query when products page is opened
				);
		} else if (!locals.data.category) {
			q.lean().exec(function(err, result) {
				// getting rid of metadata with "toObject()" from mongoose
				locals.data.products = getRidOfMetadata(result, true, 300, 300, supportWebP);
				next(err);
			});
		}
	});

	// Render the view
	view.render('products');
};

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
