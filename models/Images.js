const keystone = require('keystone');
const Types = keystone.Field.Types;
const { redis } = require('../redis');

const Images = new keystone.List('Images', {
	nocreate: false,
	noedit: false,
	autokey: {
		from: 'Title',
		path: 'key',
		unique: true
	},
	map: {
		name: 'Title'
	},
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

Images.schema.post('save', ({key}) => {
	if (redis.exists(key)) redis.del(key);
});

Images.defaultColumns = 'Title, Image, Images';
Images.register();
