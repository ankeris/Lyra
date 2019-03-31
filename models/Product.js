const keystone = require('keystone');
const Types = keystone.Field.Types;
const {redis} = require('../redis');

let Product = new keystone.List('Product', {
	map: {
		name: 'title'
	},
	singular: 'Product',
	plural: 'Products',
	autokey: {
		path: 'slug',
		from: 'title',
		unique: true
	}
});

var storage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: 'public/vid',
		publicPath: '/public/vid/'
	}
});

Product.add({
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number
	},
	Discount: {
		type: Number,
		collapse: true,
		note: 'What is the new price?'
	},
	description: {
		type: Types.Html,
		wysiwyg: true,
		height: 300
	},
	TechnicalDescription: {
		type: Types.Html,
		wysiwyg: true,
		height: 300
	},
	ManufacturersDescriptionLink: {
		type: Types.Url,
		note: 'Gamintojo nuoroda apie produkta'
	},
	UserManual: {
		type: Types.Url,
		note: 'Vartotojo vadovas'
	},
	Video: {
		type: Types.File,
		storage: storage,
		collapse: true
	},
	images: {
		type: Types.CloudinaryImages
	},
	awards: {
		type: Types.Relationship,
		ref: 'Awards',
		many: true
	},
	ProductType: {
		type: Types.Relationship,
		ref: 'ProductCategory',
		many: true
	},
	Manufacturer: {
		type: Types.Relationship,
		ref: 'ProductManufacturer',
		many: false
	},
	Highlight: {
		type: Types.Boolean
	}
});

Product.defaultColumns = 'title, ProductType, Manufacturer, images, Highlight';
Product.schema.post('save', doc => {
	if (redis.exists(`product-${doc.slug}`)) redis.del(`product-${doc.slug}`);
});

Product.register();
