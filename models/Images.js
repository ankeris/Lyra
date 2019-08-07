var keystone = require('keystone');
var Types = keystone.Field.Types;

var Images = new keystone.List('Images', {
	nocreate: false,
	noedit: false
});

Images.add({
	Title: {
		type: String,
		required: true,
		initial: true
	},
	Image: {
		type: Types.CloudinaryImage
	},
	Images: {
		type: Types.CloudinaryImages
	}
});

Images.defaultSort = 'Title, Image, Images';
Images.register();
