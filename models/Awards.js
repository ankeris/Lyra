var keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * Awards Model
 * ==================
 */

let Awards = new keystone.List('Awards', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true
	}
});

Awards.add({
	name: {
		type: String,
		required: true,
		note: 'emblemos pavadinimas (bus naudojamas paieskoje prikabinant prie produkto)'
	},
	CoverImage: {
		type: Types.CloudinaryImage
	},
	Url: {
		type: Types.Url
	}
});

Awards.defaultColumns = 'name, CoverImage';

Awards.register();
