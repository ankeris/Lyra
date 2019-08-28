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
	LogoWhite: {
		type: Types.CloudinaryImage,
		note: 'Baltas logotipas (be fono!) bus rodomas juodame fone'
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
	Priority: {
		type: Types.Select,
		numeric: true,
		default: 10,
		note: 'Rusiavimo vienetas. 1 - auksciausias prioritetas',
		options: [
			{ value: 1, label: '1' }, 
			{ value: 2, label: '2' },
			{ value: 3, label: '3' },
			{ value: 4, label: '4' },
			{ value: 5, label: '5' },
			{ value: 6, label: '6' },
			{ value: 7, label: '7' },
			{ value: 8, label: '8' },
			{ value: 9, label: '9' },
			{ value: 10, label: '10' }
		] 
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

ProductManufacturer.defaultColumns = 'name, Priority, Logo';
ProductManufacturer.register();