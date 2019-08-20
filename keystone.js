// Simulate config options from your production environment by customising the
// .env file in your project's root folder.
require('dotenv').config();

// Require keystone
const keystone = require('keystone');
const cons = require('consolidate');

// Initialise Keystone with your project's configuration. See
// http://keystonejs.com/guide/config for available options and documentation.
keystone.init({
	name: 'acme',
	brand: 'acme',
	sass: 'public',
	static: 'public',
	favicon: 'public/favicon.ico',
	views: 'templates/views',
	'view engine': '.html',
	'wysiwyg cloudinary images': true,
	'wysiwyg additional plugins': 'table, lists',
	'wysiwyg additional options': {
		toolbar:
			'fontselect fontsizeselect formatselect | bold italic | link image | alignleft aligncenter alignright alignjustify | numlist bullist | outdent indent removeformat | table tabledelete tableprops tablerowprops tablecellprops',
		block_formats: 'Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3',
		font_formats: 'Azo Sans=AzoSans; Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace;',
		content_css: ['public/general/_fonts.scss'],
		menubar: true
	},
	'custom engine': cons.nunjucks,
	'session store': 'connect-mongo',
	'view cache': true,
	'auto update': true,
	session: true,
	auth: true,
	'user model': 'User'
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set
// uniquely for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
	globaldata: require('./public/globaldata.json')
});

keystone.set('port', 80);
// Load your project's Routes
keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	products: ['products', 'product-categories', 'product-manufacturers', 'awards', 'exterior-trims'],
	news: ['news', 'NewsParagraph'],
	users: 'users',
	textAndImages: ['texts', 'images', 'about-us-paragraphs'],
	information: ['enquiries', 'subscriptions']
});

// Start Keystone to connect to your database and initialise the web server
keystone.start();
