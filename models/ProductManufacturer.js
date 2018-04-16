var keystone = require('keystone');

var ProductManufacturer = new keystone.List('ProductManufacturer', {
	autokey: { from: 'name', path: 'key', unique: true },
});

ProductManufacturer.add({
	name: { type: String, required: true },
});
console.log('hi');
// ProductManufacturer.relationship({ ref: 'Post', path: 'posts', refPath: 'categories' });
ProductManufacturer.relationship({ ref: 'Product', path: 'products', refPath: 'Manufacturer' });

ProductManufacturer.register();

