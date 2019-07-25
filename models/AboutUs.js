const keystone = require('keystone');
const Types = keystone.Field.Types;
const { redis } = require('../redis');

const AboutUsParagraphs = new keystone.List('AboutUsParagraphs', {
	map: {
		name: 'paragraphTitle'
	},
	track: true,
	autokey: {
		from: 'paragraphTitle',
		path: 'slug',
		unique: true
	}
});

AboutUsParagraphs.add({
	images: {
		type: Types.CloudinaryImages
	},
	textOnImage: {
		type: String,
		collapse: true,
		note: 'Tekstas bus dedamas tik ant pirmos nuotraukos'
	},
	paragraphTitle: {
		type: String,
		required: true,
		default: ''
	},
	body: {
		type: Types.Html,
		wysiwyg: true,
		height: 400
    },
    style: {
		type: Types.Select,
		default: 'light',
		options: [{ value: 'light', label: 'Baltas fonas + juodas tekstas' }, { value: 'dark', label: 'Juodas fonas + baltas tekstas' }]
	}
});

AboutUsParagraphs.schema.post('save', (doc) => {
	if (redis.exists('all-aboutusparagraphs')) redis.del('all-aboutusparagraphs');
});

AboutUsParagraphs.defaultColumns = 'title, image';
AboutUsParagraphs.register();
