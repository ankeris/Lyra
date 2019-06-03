const { redis } = require('../../redis');

module.exports.findItemBySlug = function ({ dbCollection, populateBy = '', prefix = '', slug, callback }) {
	redis.get(prefix + slug, function (err, reply) {
		if (err) callback(null, err);
		else if (reply) {
			// product exists in cache
			console.log(`(${prefix + slug}) Jeg kommer fra`, '\x1b[31m', 'REDIS!', '\x1b[0m');
			callback(JSON.parse(reply));
		} else {
			// product doesn't exist in cache - we need to query the main database
			console.log('product doesnt exist in cache');
			dbCollection.model
				.findOne({
					slug: slug
				})
				.lean()
				.populate(populateBy)
				.exec(function (err, doc) {
					if (err || !doc) callback(null, err);
					else {
						// product found in database, save to cache and return to client
						redis.set(prefix + slug, JSON.stringify(doc), function () {
							callback(doc);
						});
					}
				});
		}
	});
};

module.exports.findOneByKey = function ({ dbCollection, keyName, sort = '', populateBy = 'ChildCategoryOf', prefix = '', callback }) {
	redis.get(prefix + keyName, function (err, reply) {
		if (err) callback(null, err);
		else if (reply) {
			// category exists in cache
			console.log(`(${prefix + keyName}) Jeg kommer fra`, '\x1b[31m', 'REDIS!', '\x1b[0m');
			callback(JSON.parse(reply));
		} else {
			// category doesn't exist in cache - we need to query the main database
			console.log('category doesnt exist in cache');
			dbCollection.model
				.findOne({
					key: keyName
				})
				.lean()
				.sort(sort)
				.populate(populateBy)
				.exec(function (err, doc) {
					if (err || !doc) callback(null, err);
					else {
						// category found in database, save to cache and return to client
						redis.set(prefix + keyName, JSON.stringify(doc), function () {
							callback(doc);
						});
					}
				});
		}
	});
};

// Hardcoded Qrs
module.exports.homePageHighlights = function ({ dbCollection, populateBy, sort, callback }) {
	redis.get('homePageHighlights', function (err, reply) {
		if (err) callback(null, err);
		else if (reply) {
			// highlights exists in cache
			console.log(`Jeg kommer fra`, '\x1b[31m', 'REDIS!', '\x1b[0m');
			callback(JSON.parse(reply));
		} else {
			// highlights doesn't exist in cache - we need to query the main database
			console.log('highlights doesnt exist in cache');
			dbCollection.model
				.find({
					Highlight: true
				})
				.lean()
				.sort(sort)
				.populate(populateBy)
				.exec(function (err, doc) {
					if (err || !doc) callback(null, err);
					else {
						// highlights found in database, save to cache and return to client
						redis.set('homePageHighlights', JSON.stringify(doc), function () {
							callback(doc);
						});
					}
				});
		}
	});
};

module.exports.loadAll = function ({ dbCollection, populateBy = '', redisKeyName, sort = '', callback }) {
	redis.get(redisKeyName, function (err, reply) {
		if (err) callback(null, err);
		else if (reply) {
			// highlights exists in cache
			console.log(`Found ${redisKeyName} in`, '\x1b[31m', 'REDIS!', '\x1b[0m');
			callback(JSON.parse(reply));
		} else {
			// highlights doesn't exist in cache - we need to query the main database
			console.log(redisKeyName + ' are not cached yet');

			dbCollection.model
				.find()
				.lean()
				.sort({ [sort]: -1 })
				.populate(populateBy)
				.exec(function (err, doc) {
					if (err || !doc) callback(null, err);
					else {
						// highlights found in database, save to cache and return to client
						redis.set(redisKeyName, JSON.stringify(doc), function () {
							callback(doc);
						});
					}
				});
		}
	});
};
