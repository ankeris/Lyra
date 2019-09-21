/* eslint-disable no-console */
var keystone = require('keystone');
var async = require('async');

//helpers
const { getSort, getRidOfMetadata, changeFormatToWebp, isWebP, cropCloudlinaryImage } = require('../helpers');

//redis
const { loadAll, findOneByKey } = require('../redis-queries/redisQueries');

exports = module.exports = function (req, res) {
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

	// Find current brand/manufacturer
	view.on('init', function (next) {
		const categoryQueryOptions = {
			dbCollection: keystone.list('ProductManufacturer'),
			keyName: locals.filters.brand,
			prefix: 'brand-',
			callback: (result, err) => {
				if (err) throw console.error(err);
				else if (result) {
					const coverImage = result.hasOwnProperty('CoverImage') ? result.CoverImage.secure_url : null;
					if (!!coverImage && supportWebP) {
						result.CoverImage.secure_url = changeFormatToWebp(coverImage);
					}

					const exists = result.hasOwnProperty('CountryFlag');

					if (exists) {
						result.CountryFlag.secure_url = cropCloudlinaryImage(result.CountryFlag, 35, 35, supportWebP);
					}
					locals.currentBrandId = result._id;
					locals.currentBrandKey = result.key;
					locals.data.socialMedias = generateSocialMediasArr(result);
					locals.data.brand = result;
					locals.data.name = result.name;
					next(err);
				}
			}
		};
		findOneByKey(categoryQueryOptions);
	});

	// load current category object
	if (req.params.category) {
		view.on('init', next => {
			findOneByKey({
				dbCollection: keystone.list('ProductCategory'),
				keyName: locals.filters.category,
				prefix: 'category-',
				callback: (result, err) => {
					if (err) throw console.log(err);
					locals.categoryId = result._id;
					locals.categoryKey = result.key;
					locals.categoryIsParent = result.IsParentCategory;
					next(err);
				}
			});
		});
	}

	// Render the view
	view.render('brand');
};

function generateSocialMediasArr(result) {
	const arr = [];
	pushIf('website', result.WebsiteUrl);
	pushIf('facebook', result.FacebookUrl);
	pushIf('instagram', result.InstagramUrl);
	pushIf('youtube', result.YoutubeUrl);
	pushIf('pinterest', result.PinterestUrl);

	function pushIf(key, val) {
		if (val) {
			arr.push({ name: key, url: val });
		}
	}
	return arr;
}
