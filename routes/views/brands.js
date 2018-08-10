var keystone = require('keystone');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    view.query('manufacturers', keystone.list('ProductManufacturer').model.find().sort('name'));

    // Render the view
    view.render('brands');
};
