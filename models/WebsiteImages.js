var keystone = require('keystone');
var Types = keystone.Field.Types;

var WebsiteImages = new keystone.List('WebsiteImages', {
	nocreate: false,
	noedit: false
});

WebsiteImages.add({
	homePageMainPageImage: {
		type: Types.CloudinaryImage
	},
	homePageThreeButtons: {
		type: Types.CloudinaryImages
	},
	homePageDescriptionImage: {
		type: Types.CloudinaryImage,
		note: 'This image will have background animation'
	},
	specialOffersImages: {
		type: Types.CloudinaryImages
	}
});

WebsiteImages.defaultSort = '-createdAt';
WebsiteImages.register();
