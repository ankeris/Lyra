const keystone = require('keystone');
const {getRidOfMetadata, cropCloudlinaryImage, isWebP, getSort} = require('../helpers');
const async = require('async');

// redis
const redisQueries = require('../redis-queries/redisQueries');
const {loadAll, findOneByKey} = redisQueries;

exports.getSearchProducts = function(req, res) {
	const supportWebP = isWebP(req);
	const regex = new RegExp(escapeRegex(req.query.search), 'gi');
	const query = keystone.list('Product').model;

	query.find({
		$or: [
			{
				slug: regex
			},
			{
				title: regex
			}
		]
	})
		.populate('Manufacturer ProductType')
		.lean()
		.limit(20)
		.exec(
			function(err, result) {
				if (err) throw err;
				const products = getRidOfMetadata(result, true, 300, 300, supportWebP);
				res.json({
					data: products
				});
			}
		);
};

exports.getAllProducts = function (req, res) {
	const supportWebP = isWebP(req);
	const page = req.query.page || 0;
	const sort = getSort(req.query.sort) || { title: 1 };
	const limit = 9;
	const query = keystone.list('Product').model;

	query
		.find()
		.skip(page * limit)
		.limit(limit)
		.sort(sort)
		.populate('Manufacturer ProductType')
		.exec(function(err, result) {
			if (err) throw err;
			query.count({}, (err, count) => {
				const products = getRidOfMetadata(result, true, 300, 300, supportWebP);
				res.json({
					data: products,
					totalPages: Math.ceil(count / limit)
				});
			});
		});
};

exports.getProductsForCategory = function(req, res) {
	const supportWebP = isWebP(req);
	const categoryIsParent = req.query.categoryIsParent;
	const page = req.query.page || 0;
	const sort = getSort(req.query.sort) || { title: 1 };
	const limit = 9;
	const query = keystone.list('Product').model;
	
	if (categoryIsParent) {
		keystone
			.list('ProductCategory')
			.model.find({$or: [{ChildCategoryOf: req.params.id}, {_id: req.params.id}]})
			.exec(function(err, result) {
				query.count({ProductType: {$in: result}}, (err, count) => {
					query.find({
						ProductType: {$in: result}
					})
						.skip(page * limit)
						.limit(limit)
						.sort(sort)
						.populate('Manufacturer ProductType')
						.lean()
						.exec((err, result) => {
							if (err) throw err;
							res.json({
								data: getRidOfMetadata(result, true, 300, 300, supportWebP),
								totalPages: Math.ceil(count / limit)
							});
						});
				});
			});
	} else {
		query.find({
			ProductType: req.params.id
		})
			.skip(page * limit)
			.limit(limit)
			.sort(sort)
			.populate('Manufacturer ProductType')
			.lean()
			.exec((err, result) => {
				query.count({}, (err, count) => {
					res.json({
						data: getRidOfMetadata(result, true, 300, 300, supportWebP),
						totalPages: Math.ceil(count / limit)
					});
				});
				if (err) throw err;
			});
	}
};

exports.getProductsForCategoryInBrand = function(req, res) {
	const supportWebP = isWebP(req);
	const categoryIsParent = req.query.categoryIsParent;
	const page = req.query.page || 0;
	const sort = getSort(req.query.sort) || { title: 1 };
	const limit = 9;
	const query = keystone.list('Product').model;

	if (categoryIsParent) {
		keystone
			.list('ProductCategory')
			.model.find({ $or: [{ ChildCategoryOf: req.params.categoryId }, { _id: req.params.categoryId }] })
			.exec((err, result) => {
				query.count({ProductType: { $in: result }, Manufacturer: req.params.brandId}, (err, count) => {
					query.find({
						ProductType: { $in: result },
						Manufacturer: req.params.brandId
					})
						.skip(page * limit)
						.limit(limit)
						.sort(sort)
						.populate('Manufacturer ProductType')
						.exec((err, result) => {
							if (err) throw err;
							if (err) throw err;
							res.json({
								data: getRidOfMetadata(result, true, 300, 300, supportWebP),
								totalPages: Math.ceil(count / limit)
							});
						});
				});
			});
	} // Load products of all children categories of parent category
	else if (!categoryIsParent) {
		query.find({
			ProductType: req.params.categoryId,
			Manufacturer: req.params.brandId
		})
			.skip(page * limit)
			.limit(limit)
			.sort(sort)
			.populate('Manufacturer ProductType')
			.exec(function (err, result) {
				if (err) throw err;
				res.json({
					data: getRidOfMetadata(result, true, 300, 300, supportWebP),
					totalPages: 1
				});
			});
	}
};

exports.getAllProductsForManufacturer = function(req, res) {
	const supportWebP = isWebP(req);
	const page = req.query.page || 0;
	const sort = getSort(req.query.sort) || { title: 1 };
	const limit = 9;
	const query = keystone.list('Product').model;

	query
		.find({
			Manufacturer: req.params.id
		})
		.skip(page * limit)
		.limit(limit)
		.sort(sort)
		.populate('Manufacturer ProductType')
		.exec(function(err, result) {
			if (err) throw err;
			query.count({Manufacturer: req.params.id}, (err, count) => {
				const products = getRidOfMetadata(result, true, 300, 300, supportWebP);
				res.json({
					data: products,
					totalPages: Math.ceil(count / limit)
				});
			});
		});
};

exports.getAllCategories = function (req, res, next) {
	const loadAllCategoriesQuery = {
		dbCollection: keystone.list('ProductCategory'),
		sort: 'Priority',
		redisKeyName: 'all-categories',
		populateBy: 'ChildCategoryOf',
		callback: (cats, err) => {
			if (err || !cats.length) {
				return next(err);
			}
			res.json(cats);
		}
	};
	loadAll(loadAllCategoriesQuery);
};

exports.getAllCategoriesForManufacturer = function (req, res) {
	const loadAllCategoriesQuery = {
		dbCollection: keystone.list('ProductCategory'),
		sort: 'Priority',
		redisKeyName: 'all-categories',
		callback: (cats, err) => {
			const allCategories = cats;
			const categoriesToDisplay = [];
			async.each(
				allCategories,
				function (category, next) {
					keystone
						.list('Product')
						.model.count()
						.where('ProductType')
						.in([category])
						.where('Manufacturer')
						.in([req.params.id])
						.exec(function (err, count) {
							if (err) throw err;
							category.postCount = count;

							if (category.postCount > 0) {
								categoriesToDisplay.push(category);
							}
							next(err);
						});
				},
				function (err) {
					if (err) throw err;
					categoriesToDisplay.sort((a, b) => (a.name > b.name ? 1 : -1))
					res.json(categoriesToDisplay);
				}
			);
			if (err || !cats.length) {
				throw err;
			}
		}
	};

	loadAll(loadAllCategoriesQuery);
};

exports.getAllManufacturers = function (req, res, next) {
	const loadAllManufacturersQuery = {
		dbCollection: keystone.list('ProductManufacturer'),
		sort: 'Priority',
		redisKeyName: 'all-brands',
		callback: (result, err) => {
			if (err || !result.length) {
				return next(err);
			}
			res.json(result);
		}
	};
	loadAll(loadAllManufacturersQuery);
};

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}