const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * ExteriorTrims Model
 * ==================
 */

const ExteriorTrims = new keystone.List('ExteriorTrims', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true
	}
});

ExteriorTrims.add({
	name: {
		type: String,
		required: true,
		note: 'Apdailos pavadinimas'
	},
	image: {
		type: Types.CloudinaryImage
	}
});

ExteriorTrims.defaultColumns = 'name, image';
ExteriorTrims.register();
