const keystone = require('keystone');
const Types = keystone.Field.Types;
const {redis} = require('../redis');

const News = new keystone.List('News', {
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

News.add({
	title: {
		type: String,
		required: true
	},
	description: {
		type: Types.Html,
		wysiwyg: true,
		height: 200
	},
	image: {
		type: Types.CloudinaryImage
	},
	ButtonStyle: {
		type: Types.Select,
		default: 'dark',
		options: [{value: 'dark', label: 'Juodas mygtukas'}, {value: 'light', label: 'Baltas mygtukas'}]
	}
});
News.schema.post('save', () => {
	if (redis.exists('all-news')) redis.del('all-news');
});

News.defaultColumns = 'title, image';
News.register();
