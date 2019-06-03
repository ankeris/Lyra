const keystone = require('keystone');
const { redis } = require('../redis');
const Types = keystone.Field.Types;

const NewsParagraph = new keystone.List('NewsParagraph', {
	map: {
		name: 'paragraphTitle'
	},
	track: true
});

NewsParagraph.add({
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
	text: {
		type: Types.Html,
		wysiwyg: true,
		height: 400
	},
	style: {
		type: Types.Select,
		default: 'light',
		options: [{ value: 'light', label: 'Baltas fonas + juodas tekstas' }, { value: 'dark', label: 'Juodas fonas + baltas tekstas' }]
	},
	BelongsTo: {
		type: Types.Relationship,
		ref: 'News',
		many: true
	},
	awards: {
		type: Types.Relationship,
		ref: 'Awards',
		many: true
	},
});

NewsParagraph.defaultColumns = 'paragraphTitle, images, BelongsTo';

NewsParagraph.register();
