var path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    mode: 'development',
    watch: true,
    entry: './public/js/manual/separateManufacturers.js',
    output: {
      path: path.resolve('./public/js/', 'dist'),
      filename: 'bundle.js'
    },
    plugins: [
        new BrowserSyncPlugin({
          // browse to http://localhost:3000/ during development,
          // ./public directory is being served
          host: 'localhost',
          port: 3000,
          files: ['./templates/views/*.html'],
          server: { baseDir: ['templates'] },
        })
    ]
};