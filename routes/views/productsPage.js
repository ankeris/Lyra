const keystone = require('keystone');
const {cropCloudlinaryImage, isWebP} = require('../helpers');
// redis	
const redisQueries = require('../redis-queries/redisQueries');	
const {findOneByKey} = redisQueries;

exports = module.exports = function(req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;
	locals.data = {};
	
	view.on('init', next => {	
		if (req.params.category) {	
			findOneByKey({	
				dbCollection: keystone.list('ProductCategory'),	
				keyName: req.params.category,	
				prefix: 'category-',	
				callback: (result, err) => {	
					if (err) throw err;	
					else {	
						if (result) {
							locals.categoryId = result._id;
							locals.categoryKey = result.key;
							locals.categoryIsParent = result.IsParentCategory;

							result.CoverImage.secure_url = cropCloudlinaryImage(result.CoverImage, 1600, 1600, isWebP(req));	
							locals.data.category = result;	
							// Create dynamic links for router	
							locals.data.dynamicLinkArr = [{	
								name: 'produktai',	
								url: '/produktai/'	
							},	
							result && result.ChildCategoryOf ? {	
								name: result.ChildCategoryOf.name,	
								url: '/produktai/' + result.ChildCategoryOf.key	
							} : null,	
							{	
								name: result.name,	
								url: '/produktai/' + result.key	
							}];	
						}	
						next(err);	
					}
 				}	
			});	
		} else {	
			next();	
		}	
	});

	// Images and text	
	if (!req.params.category) {	
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

 		view.on('init', (next) => {	
			findOneByKey({	
				dbCollection: keystone.list('Images'),	
				keyName: 'products-page-intro-image',	
				callback: ({Image}, err) => {	
					Image.secure_url = cropCloudlinaryImage(Image, 1600, 1600, isWebP(req));	
					locals.data.productsPageIntroImage = Image;	
					next(err);	
				}	
			});	
		});	
	}
	// Render the view
	view.render('products');
};