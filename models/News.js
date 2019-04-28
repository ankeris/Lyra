const keystone = require('keystone');
const Types = keystone.Field.Types;
const {redis} = require('../redis');
const path = require('path');
const fs = require('fs');

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

var storage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: 'public/vid_news',
		publicPath: '/public/vid_news/'
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
		type: Types.CloudinaryImage,
		collapse: true
	},
	video: {
		type: Types.File,
		storage: storage
	},
	ButtonStyle: {
		type: Types.Select,
		default: 'dark',
		options: [{value: 'dark', label: 'Juodas mygtukas'}, {value: 'light', label: 'Baltas mygtukas'}]
	},
	hidden: {
		type: Boolean,
		note: 'Hide from the page?'
	}
});
News.schema.post('save', () => {
	if (redis.exists('all-news')) redis.del('all-news');
	const opts = keystone.options();
	const videosPath = path.join(opts['module root'], opts.static + '/vid_news');

	keystone
		.list('News')
		.model.find()
		.then(news => {
			const filesInDb = [];
			news.forEach(item => {
				if (item.video.filename) {
					filesInDb.push(item.video.filename);
				}
			});

			// Look for files that don't exist in DB and delete them
			fs.readdir(videosPath, (err, files) => {
				if (err) throw err;
				files.forEach(function(file) {
					if (filesInDb.indexOf(file) == -1) {
						fs.unlink(`${videosPath}/${file}`, err => {
							if (err) throw err;
						});
					}
				});
			});
		});
});

News.defaultColumns = 'title, image';
News.register();
