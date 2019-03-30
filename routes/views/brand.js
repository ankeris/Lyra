var keystone = require('keystone');
var async = require('async');

//helpers
const {getSort, getRidOfMetadata, changeFormatToWebp, isWebP, cropCloudlinaryImage} = require('../helpers');

//redis
const {loadAll, findOneByKey} = require('../redis-queries/redisQueries');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	const supportWebP = isWebP(req);

	locals.data = {
		products: [],
		socialMedias: [],
		sort: req.query.filterlist
	};

	locals.filters = {
		brand: req.params.brand,
		category: req.params.category
	};

	// All manufacturers for sidenav
	view.on('init', function(next) {
		const loadAllCategoriesQuery = {
			dbCollection: keystone.list('ProductManufacturer'),
			sort: 'name',
			redisKeyName: 'all-categories',
			populateBy: 'ChildCategoryOf',
			callback: (result, err) => {
				locals.data.manufacturers = result;
				if (err || !result.length) {
					return next(err);
				}
				next();
			}
		};

		loadAll(loadAllCategoriesQuery);
	});

	// Find current brand/manufacturer
	view.on('init', function(next) {
		const categoryQueryOptions = {
			dbCollection: keystone.list('ProductManufacturer'),
			keyName: locals.filters.brand,
			callback: (result, err) => {
				if (err) throw console.error(err);
				else {
					if (result.CoverImage && supportWebP) {
						const coverImage = result.CoverImage.secure_url;
						result.CoverImage.secure_url = changeFormatToWebp(coverImage);
					}
					const countryFlag = result.CountryFlag || null;
					if (countryFlag) {
						result.CountryFlag.secure_url = cropCloudlinaryImage(countryFlag, 50, 37, supportWebP);
					}
					locals.data.socialMedias = [...socialMediasArr(result)];
					locals.data.brand = result;
					locals.data.name = result.name;
					next(err);
				}
			}
		};
		findOneByKey(categoryQueryOptions);
	});

	// All categories for side navigation
	view.on('init', function(next) {
		keystone
			.list('ProductCategory')
			.model.find()
			.sort('name')
			.populate('ChildCategoryOf')
			.exec(function(err, results) {
				if (err || !results.length) {
					return next(err);
				}

				locals.data.allCategories = results;
				let categoriesToDisplay = [];
				//Load the counts for each category (counts how much products every category contains)
				async.each(
					locals.data.allCategories,
					function(category, next) {
						keystone
							.list('Product')
							.model.count()
							.where('ProductType')
							.in([category.id])
							.where('Manufacturer')
							.in([locals.data.brand])
							.exec(function(err, count) {
								category.postCount = count;

								if (category.postCount > 0) {
									categoriesToDisplay.push(category);
								}
								next(err);
							});
					},
					function(err) {
						categoriesToDisplay.sort();
						locals.data.categories = categoriesToDisplay;
						next(err);
					}
				);
			});
	});

	// Load products
	view.on('init', function(next) {
		let r = keystone.list('Product').paginate({
			page: req.query.page || 1,
			perPage: 9,
			maxPages: 10
		});
		r.populate('Manufacturer ProductType').sort(getSort(req.query.filterlist));

		if (!locals.data.category) {
			r.find({
				Manufacturer: locals.data.brand
			}).exec(function(err, result) {
				if (err) {
					next(err);
				} else {
					locals.data.products = getRidOfMetadata(result, true, 300, 300, supportWebP);
					next(err);
				}
			});
		}

		if (locals.data.category) {
			// Load products for basic categories (without subcategories)
			if (!locals.data.category.IsParentCategory) {
				r.find({
					ProductType: locals.data.category,
					Manufacturer: locals.data.brand
				}).exec(function(err, result) {
					if (err) {
						next(err);
					} else {
						locals.data.products = getRidOfMetadata(result, true, 300, 300);
						next(err);
					}
				});
			} // Load products of all children categories of parent category
			else if (locals.data.category.IsParentCategory) {
				keystone
					.list('ProductCategory')
					.model.find({ChildCategoryOf: locals.data.category})
					.exec(function(err, result) {
						r.find({
							ProductType: {$in: result},
							Manufacturer: locals.data.brand
						}).exec(function(err, result) {
							if (err) {
								next(err);
							} else {
								locals.data.products = getRidOfMetadata(result, true, 300, 300);
								next(err);
							}
						});
					});
			}
		}
	});

	// Render the view
	view.render('brand');
};

function socialMediasArr(result) {
	const arr = [];
	pushIf('website', result.WebsiteUrl);
	pushIf('facebook', result.FacebookUrl);
	pushIf('instagram', result.InstagramUrl);
	pushIf('youtube', result.YoutubeUrl);
	pushIf('pinterest', result.PinterestUrl);

	function pushIf(key, val) {
		if (val) {
			arr.push({name: key, url: val});
		}
	}
	return arr;
}
