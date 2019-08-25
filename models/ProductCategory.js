var keystone = require('keystone');
let Types = keystone.Field.Types;
const { redis } = require('../redis');

/**
 * ProductCategory Model
 * ==================
 */

const ProductCategory = new keystone.List('ProductCategory', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true
	}
});

ProductCategory.add({
	name: {
		type: String,
		required: true,
		note: 'pavadinimas daugiskaitos forma'
	},
	nameSingular: {
		type: String,
		required: false,
		note: 'vienaskaitos forma'
	},
	discount: {
		type: Number,
		note: '% 1-100 %'
	},
	CoverImage: {
		type: Types.CloudinaryImage
	},
	description: {
		type: Types.Html,
		wysiwyg: true,
	},
	ChildCategoryOf: {
		type: Types.Relationship,
		ref: 'ProductCategory',
		many: false,
		required: false
	},
	IsParentCategory: {
		type: Types.Boolean
	}
});

ProductCategory.relationship({
	ref: 'Product',
	path: 'products',
	refPath: 'ProductType'
});

ProductCategory.schema.post('save', cat => {
	if (redis.exists('all-categories')) redis.del('all-categories');
	if (redis.exists('category-' + cat.key)) redis.del('category-' + cat.key);
});

ProductCategory.schema.post('remove', cat => {
	if (redis.exists('all-categories')) redis.del('all-categories');
	if (redis.exists('category-' + cat.key)) redis.del('category-' + cat.key);
});

ProductCategory.defaultColumns = 'name, ChildCategoryOf, IsParentCategory, discount';

ProductCategory.register();
