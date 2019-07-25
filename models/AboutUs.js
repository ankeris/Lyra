const keystone = require('keystone');
const Types = keystone.Field.Types;
const { redis } = require('../redis');

const AboutUs = new keystone.List('AboutUs', {
	map: {
		name: 'title'
	},
	track: true,
	autokey: {
		from: 'title',
		path: 'slug',
		unique: true
	}
});

AboutUs.add({
	title: {
		type: String,
		required: true
	},
	body: {
		type: Types.Html,
		wysiwyg: true,
		height: 200
	}
});

AboutUs.schema.post('save', (doc) => {
	
});

AboutUs.schema.post('delete', () => {
	if (redis.exists('all-aboutus')) redis.del('all-aboutus');
});

AboutUs.defaultColumns = 'title, image';
AboutUs.register();
