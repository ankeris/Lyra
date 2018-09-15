let path = require('path');
const glob = require('glob');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    mode: 'development', //add 'production' when deploy
    // watch: true,
    entry: {
        global: glob.sync('./public/js/manual/global/*.js'),
        index: glob.sync('./public/js/manual/index/*.js'),
        products: glob.sync('./public/js/manual/products/*.js'),
        product: glob.sync('./public/js/manual/product/*.js')
    },
    output: {
        path: path.resolve('./public/js/', 'dist'),
        filename: "[name].bundle.js"
    },
    plugins: [
        new BrowserSyncPlugin({
          // browse to http://localhost:3000/ during development,
          // ./public directory is being served
          host: 'localhost',
          port: 8080,
          files: [
            './templates/views/**/*.html',
            './public/styles/**/*.scss',
            './public/js/manual/**/*.js'
            ],
          proxy: 'http://localhost:8080/'
        })
    ]
};