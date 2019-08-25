const keystone = require('keystone');

// redis
const {homePageHighlights, findOneByKey} = require('../redis-queries/redisQueries');

//helpers
const {isWebP, getRidOfMetadata, cropCloudlinaryImage} = require('../helpers');

exports = module.exports = function(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;
	const supportWebP = isWebP(req);
	locals.supportWebP = supportWebP;
	locals.section = 'home';
	locals.products = [];

	view.on('init', function(next) {
		const highlightQueryOptions = {
			dbCollection: keystone.list('Product'),
			populateBy: 'Manufacturer ProductType',
			sort: 'publishedDate',
			callback: (hlts, err) => {
				if (err) throw err;
				locals.products = getRidOfMetadata(hlts, true, 300, 300, locals.supportWebP);
				next();
			}
		};

		homePageHighlights(highlightQueryOptions);
	});

	view.on('init', function (next) {
		findOneByKey({
			dbCollection: keystone.list('Texts'),
			keyName: 'main-page-intro-sentence',
			callback: ({Text}, err) => {
				locals.mainPageIntroSentence = Text.replace(/<[^>]*>?/gm, '').split(' ');
				next(err);
			}
		});
	});

	view.on('init', function (next) {
		findOneByKey({
			dbCollection: keystone.list('Texts'),
			keyName: 'main-page-lyra-description',
			callback: ({Text}, err) => {
				locals.mainPageLyraDescription = Text;
				next(err);
			}
		});
	});
	
	view.on('init', function (next) {
		findOneByKey({
			dbCollection: keystone.list('Images'),
			keyName: 'main-page-intro-image',
			callback: ({Image}, err) => {
				locals.mainPageIntroImage = cropCloudlinaryImage(Image, 1600, 1600, supportWebP);
				next(err);
			}
		});
	});

	view.on('init', function (next) {
		findOneByKey({
			dbCollection: keystone.list('Images'),
			keyName: 'main-page-description-image',
			callback: ({Image}, err) => {
				locals.mainPageDescriptionImage = cropCloudlinaryImage(Image, 1600, 1600, supportWebP);
				next(err);
			}
		});
	});

	view.on('init', function (next) {
		findOneByKey({
			dbCollection: keystone.list('Images'),
			keyName: 'main-page-3-navigating-images',
			callback: ({Images}, err) => {
				Images.forEach(image => image.secure_url = cropCloudlinaryImage(image, 400, 400, supportWebP));
				locals.mainPage3NavigationImages = Images;
				next(err);
			}
		});
	});

	view.render('index');
};