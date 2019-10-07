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
		required: true,
		initial: true
	},
	CategoryNameForm: {
		type: Types.Select, 
		options: 'Plural, Singular',
		default: 'Plural',
		note: 'Pasirinkti ar produkto pavadinimo naudoti kategorijos DAUGISKAITOS ar VIENASKAITOS forma'
	},
	price: {
		type: Number
	},
	isProductCable: {
		type: Boolean,
		default: false,
		note: 'Pazymeti, jei produkas - laidas'
	},
	cableLength: {
		type: Types.Code,
		dependsOn: { isProductCable: true },
		language: 'json',
		default: '[]',
		required: true,
		note: `[{
	"ilgis": 0.5,
	"kaina": 40
},
{
	"ilgis": 1,
	"kaina": 70
}]`
	},
	Discount: {
		type: Number,
		collapse: true,
		note: 'What is the new price?'
	},
	seoDescription: { 
		type: Types.Text,
		min: 100,
		max: 320,
		note: 'Nuo 100 iki 320 raidziu SEO aprasymas'
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
		height: 300,
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
		many: false,
		required: true,
		initial: true
	},
	Manufacturer: {
		type: Types.Relationship,
		ref: 'ProductManufacturer',
		many: false,
		required: true,
		initial: true
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

Product.schema.pre('validate', function(next) {
	if (this.isProductCable && !Array.isArray(JSON.parse(this.cableLength))) {
		next(Error('"cableLength" - make sure objects are wrapped in [ ]'));
	}
	if (this.isProductCable && this.cableLength && JSON.parse(this.cableLength).length == 0) {
		next(Error('"cableLength" - field is missing objects! Example: [{ ilgis: 0.5, kaina: 40 }, { ilgis: 1, kaina: 70 }]'));
	} else {
		next();
	}
});

Product.defaultColumns = 'title, ProductType, Manufacturer, images, Highlight';

Product.schema.pre('save', function (next) {
	if (this.modifiedPaths().includes('Highlight')) {
		if (redis.exists('homePageHighlights')) redis.del('homePageHighlights');
	}
	next();
});

Product.schema.post('save', doc => {
	if (redis.exists(`product-${doc.slug}`)) redis.del(`product-${doc.slug}`);
});

Product.register();
