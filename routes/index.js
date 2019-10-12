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

const keystone = require('keystone');
const middleware = require('./middleware');
const helmet = require('helmet');
const importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);
keystone.pre('render', middleware.setHeaders);

// Import Route Controllers
const routes = {
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function(app) {
	app.use(helmet());
	// Views
	app.get('/', routes.views.index);
	app.get('/prekiu-zenklai', routes.views.brands);
	app.get('/prekiu-zenklai/:brand/:category?', routes.views.brand);
	app.all('/kontaktai', routes.views.contact);
	app.get('/nuolaidos/:category?', routes.views.specialoffers);
	app.get('/naujienos', routes.views.news);
	app.get('/naujienos/:newsItem', routes.views.new);
	app.get('/apie-mus', routes.views.aboutus);
	app.get('/produktai/:category?', routes.views.productsPage);
	app.get('/produktai/:Manufacturer?/:category?/:product', routes.views.product);
	// Headless responses
	app.get('/api/products/getAll', routes.views.api.getAllProducts);
	app.get('/api/products/getAll/discounted', routes.views.api.getAllDiscountedProducts);
	app.get('/api/products/getAll/:id', routes.views.api.getProductsForCategory);
	app.get('/api/products/getAll/manufacturer/:id', routes.views.api.getAllProductsForManufacturer);
	app.get('/api/products/getAll/manufacturer/:brandId/category/:categoryId', routes.views.api.getProductsForCategoryInBrand);
	app.get('/api/products/getSearched', routes.views.api.getSearchProducts);
	app.get('/api/categories/getAll', routes.views.api.getAllCategories);
	app.get('/api/categories/getAll/manufacturer/:id', routes.views.api.getAllCategoriesForManufacturer);
	app.get('/api/manufacturers/getAll', routes.views.api.getAllManufacturers);
	// Additional
	app.get('*', routes.views['404']);
	app.post('*', routes.views.subscription);
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
};
