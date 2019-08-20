const keystone = require('keystone');
const Types = keystone.Field.Types;
const { redis } = require('../redis');

const Product = new keystone.List('Product', {
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

Product.add({
	title: {
		type: String,
		required: true
	},
	CategoryNameForm: {
		type: Types.Select, 
		options: 'Plural, Singular',
		default: 'Plural',
		initial: 'Plural',
		note: 'Pasirinkti ar produkto pavadinimo naudoti kategorijos DAUGISKAITOS ar VIENASKAITOS forma'
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
	FeaturesDescription: {
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
	YoutubeVideoLink: {
		type: Types.Url,
		note: 'pvz: https://www.youtube.com/embed/mlHklH5VBtI'
	},
	images: {
		type: Types.CloudinaryImages
	},
	awards: {
		type: Types.Relationship,
		ref: 'Awards',
		many: true
	},
	exteriorTrims: {
		type: Types.Relationship,
		ref: 'ExteriorTrims',
		many: true
	},
	ProductType: {
		type: Types.Relationship,
		ref: 'ProductCategory',
		many: true,
		required: true,
		initial: false
	},
	Manufacturer: {
		type: Types.Relationship,
		ref: 'ProductManufacturer',
		many: false,
		required: true,
		initial: false
	},
	RelatedProducts: {
		type: Types.Relationship,
		ref: 'Product',
		many: true,
		required: false,
		initial: false
	},
	Highlight: {
		type: Types.Boolean,
		note: 'Jei pasirinkta, produktas rodomas pagrindiniame puslapyje apacioje'
	}
});

Product.defaultColumns = 'title, ProductType, Manufacturer, images, Highlight';
Product.schema.post('save', doc => {
	if (redis.exists(`product-${doc.slug}`)) redis.del(`product-${doc.slug}`);
});

Product.register();
