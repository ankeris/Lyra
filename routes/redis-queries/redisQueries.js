const redisClient = require('redis').createClient;
const redis = redisClient(6379, '127.0.0.1');

module.exports.findItemBySlug = function({dbCollection, populateBy = '', slug, callback}) {
	redis.get(slug, function(err, reply) {
		if (err) callback(null, err);
		else if (reply) {
			// product exists in cache
			console.log('Jeg kommer fra', '\x1b[31m', 'REDIS!', '\x1b[0m');
			callback(JSON.parse(reply));
		} else {
			// product doesn't exist in cache - we need to query the main database
			console.log('product doesnt exist in cache');
			dbCollection.model
				.findOne({
					slug: slug
				})
				.populate(populateBy)
				.exec(function(err, doc) {
					if (err || !doc) callback(null, err);
					else {
						// product found in database, save to cache and return to client
						redis.set(slug, JSON.stringify(doc), function() {
							callback(doc);
						});
					}
				});
		}
	});
};

module.exports.findCategoryByKey = function({dbCollection, categoryKey, callback}) {
	redis.get(categoryKey, function(err, reply) {
		if (err) callback(null, err);
		else if (reply) {
			// category exists in cache
			console.log('Jeg kommer fra', '\x1b[31m', 'REDIS!', '\x1b[0m');
			callback(JSON.parse(reply));
		} else {
			// category doesn't exist in cache - we need to query the main database
			console.log('category doesnt exist in cache');
			dbCollection.model
				.findOne({
					key: categoryKey
				})
				.exec(function(err, doc) {
					if (err || !doc) callback(null, err);
					else {
						// category found in database, save to cache and return to client
						redis.set(categoryKey, JSON.stringify(doc), function() {
							callback(doc);
						});
					}
				});
		}
	});
};

// Update Qrs
module.exports.updateBookByTitle = function(db, title, newText, callback) {
	db.collection('text').findAndModify(
		{
			title: title
		},
		{
			$set: {
				text: text
			}
		},
		function(err, doc) {
			//Update the main database
			if (err) callback(err);
			else if (!doc) callback('Missing book');
			else {
				//Save new book version to cache
				redis.set(title, JSON.stringify(doc), function(err) {
					if (err) callback(err);
					else callback(null);
				});
			}
		}
	);
};
