let keystone = require('keystone');
let Types = keystone.Field.Types;

let Product = new keystone.List('Product', {
    map: {name: 'title'},
    singular: 'Product',
    plural: 'Products',
    autokey: {path: 'slug', from: 'title', unique: true}
});

Product.add({
    title: {type: String, required: true},
    price: {type: Number},
    qty: {type: Number},
    description: {type: Types.Html, wysiwyg: true, height: 300},
    image: {type: Types.CloudinaryImage},
    publishedDate: {type: Date, default: Date.now},
    categories: { type: Types.Relationship, ref: 'PostCategory', many: true }
})

Product.register();