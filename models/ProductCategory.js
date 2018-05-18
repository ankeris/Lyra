var keystone = require('keystone');

/**
 * ProductCategory Model
 * ==================
 */

let ProductCategory = new keystone.List('ProductCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

ProductCategory.add({
    name: { type: String, required: true },
});

ProductCategory.relationship({ ref: 'Product', path: 'products', refPath: 'ProductType' });

ProductCategory.register();
