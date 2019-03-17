var keystone = require('keystone');
let Types = keystone.Field.Types;
const {redis} = require('../redis');

var ProductManufacturer = new keystone.List('ProductManufacturer', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true
	}
});

ProductManufacturer.add({
	name: {
		type: String,
		required: true
	},
	description: {
		type: Types.Html,
		wysiwyg: true
	},
	Logo: {
		type: Types.CloudinaryImage
	},
	SmallPreviewImage: {
		type: Types.CloudinaryImage
	},
	CoverImage: {
		type: Types.CloudinaryImage
	}
});

// ProductManufacturer.relationship({ ref: 'Post', path: 'posts', refPath: 'categories' });
ProductManufacturer.relationship({
	ref: 'Product',
	path: 'products',
	refPath: 'Manufacturer'
});

ProductManufacturer.schema.post('save', () => {
	if (redis.exists('allManufacturers')) redis.del('allManufacturers');
});

ProductManufacturer.register();
