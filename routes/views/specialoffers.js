const keystone = require('keystone');
// redis
const {findOneByKey} = require('../redis-queries/redisQueries');

// helpers
const {isWebP, cropCloudlinaryImage} = require('../helpers');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	const supportWebP = isWebP(req);
	locals.section = 'Lyra | Nuolaidos | Pasiūlymai';
	locals.supportWebP = supportWebP;

	view.on('init', function(next) {
		findOneByKey({
			dbCollection: keystone.list('Texts'),
			keyName: 'special-offers-main-text',
			callback: ({Text}, err) => {
				locals.specialOffersMainText = Text;
				next(err);
			}
		});
	});

	view.on('init', function(next) {
		findOneByKey({
			dbCollection: keystone.list('Images'),
			keyName: 'special-offers-main-image',
			callback: ({Image}, err) => {
				locals.specialOffersMainImage = cropCloudlinaryImage(Image, 1600, 1600, supportWebP);
				next(err);
			}
		});
	});

	// Render the view
	view.render('specialoffers');
};
