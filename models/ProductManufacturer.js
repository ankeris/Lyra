var keystone = require('keystone');
let Types = keystone.Field.Types;

var ProductManufacturer = new keystone.List('ProductManufacturer', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true
	},
});

ProductManufacturer.add({
	name: {
		type: String,
		required: true
	},
	image: {
		type: Types.CloudinaryImage
	},
});

// ProductManufacturer.relationship({ ref: 'Post', path: 'posts', refPath: 'categories' });
ProductManufacturer.relationship({
	ref: 'Product',
	path: 'products',
	refPath: 'Manufacturer'
});

ProductManufacturer.register();
