const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Texts Model
 * ==================
 */

const Texts = new keystone.List('Texts', {
	nocreate: false,
	noedit: false,
	autokey: {
		from: 'Title',
		path: 'key',
		unique: true
	},
	map: {
		name: 'Title'
	},
});

Texts.add({
	Title: {
		type: String,
		required: true,
		initial: true
	},
	Text: {
		type: Types.Html,
		wysiwyg: true,
		height: 400
	}
});

Texts.defaultColumns = 'Title, Text';
Texts.register();