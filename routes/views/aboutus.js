const keystone = require('keystone');
const { loadAll } = require('../redis-queries/redisQueries');
const { getRidOfMetadata, cropCloudlinaryImage, isWebP } = require('../helpers');

exports = module.exports = function (req, res) {
	const supportWebP = isWebP(req);
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'Apie Lyra';
	locals.data = {
		paragraphs: []
	}

	view.on('init', function (next) {
		const loadAllParagraphs = {
			dbCollection: keystone.list('AboutUsParagraphs'),
			sort: 'name',
			redisKeyName: 'all-aboutusparagraphs',
			callback: (result, err) => {
				result.forEach(paragraph => {
					paragraph.images.forEach(image => {
						image.secure_url = cropCloudlinaryImage(image, 1250, 1250, supportWebP);
					});
				})
				locals.data.paragraphs = result;

				if (err || !result.length) {
					return next(err);
				}
				next();
			}
		};
		loadAll(loadAllParagraphs);
	});

	// Render the view
	view.render('aboutus');
};
