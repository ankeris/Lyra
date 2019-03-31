var keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * ProductCategory Model
 * ==================
 */

let ProductCategory = new keystone.List('ProductCategory', {
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
		note: 'daugiskaitos forma'
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

ProductCategory.defaultColumns = 'name, ChildCategoryOf, IsParentCategory, discount';

ProductCategory.register();
