/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

let keystone = require('keystone');
let middleware = require('./middleware');
let importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
const routes = {
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function(app) {
	// Views
	app.get('/', routes.views.index);
	app.get('/prekiu-zenklai', routes.views.brands);
	app.get('/prekiu-zenklai/:brand/:category?', routes.views.brand);
	app.all('/kontaktai', routes.views.contact);
	app.get('/nuolaidos/:category?', routes.views.specialoffers);
	app.get('/naujienos', routes.views.news);
	app.get('/naujienos/:newsItem', routes.views.new);
	app.get('/apie-mus', routes.views.aboutus);
	app.get('/produktai/:category?', routes.views.products);
	app.get('/produktai/:Manufacturer?/:category?/:product', routes.views.product);
	app.get('*', routes.views['404']);
	app.post('*', routes.views.subscription);
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
};
