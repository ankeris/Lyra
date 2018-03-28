var keystone = require('keystone');

var ProductManufacturer = new keystone.List('ProductManufacturer', {
	autokey: { from: 'name', path: 'key', unique: true },
});

ProductManufacturer.add({
	name: { type: String, required: true },
});

// ProductManufacturer.relationship({ ref: 'Post', path: 'posts', refPath: 'categories' });
ProductManufacturer.relationship({ ref: 'Product', path: 'products', refPath: 'categories' });

ProductManufacturer.register();
