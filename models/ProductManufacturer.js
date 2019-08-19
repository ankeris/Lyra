const keystone = require('keystone');
let Types = keystone.Field.Types;
const { redis } = require('../redis');

const ProductManufacturer = new keystone.List('ProductManufacturer', {
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
	CountryName: {
		type: String
	},
	CountryFlag: {
		type: Types.CloudinaryImage
	},
	Logo: {
		type: Types.CloudinaryImage
	},
	SmallPreviewImage: {
		type: Types.CloudinaryImage,
		required: true,
		initial: false,
		note: 'Bus rodoma "/prekiu-zenklai" puslapyje'
	},
	CoverImage: {
		type: Types.CloudinaryImage,
		note: 'Bus rodoma sio gamintojo puslapio virsuje (plati nuotrauka)'
	},
	WebsiteUrl: {
		type: Types.Url,
		collapse: true
	},
	FacebookUrl: {
		type: Types.Url,
		collapse: true
	},
	InstagramUrl: {
		type: Types.Url,
		collapse: true
	},
	YoutubeUrl: {
		type: Types.Url,
		collapse: true
	},
	PinterestUrl: {
		type: Types.Url,
		collapse: true
	}
});

// ProductManufacturer.relationship({ ref: 'Post', path: 'posts', refPath: 'categories' });
ProductManufacturer.relationship({
	ref: 'Product',
	path: 'products',
	refPath: 'Manufacturer'
});

ProductManufacturer.schema.post('save', brand => {
	if (redis.exists('all-brands')) redis.del('all-brands');
	if (redis.exists('brand-' + brand.key)) redis.del('brand-' + brand.key);
});

ProductManufacturer.schema.post('remove', brand => {
	if (redis.exists('all-brands')) redis.del('all-brands');
	if (redis.exists('brand-' + brand.key)) redis.del('brand-' + brand.key);
});

ProductManufacturer.register();
