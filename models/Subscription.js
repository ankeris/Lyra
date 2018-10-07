var keystone = require('keystone');
var Types = keystone.Field.Types;

var Subscription = new keystone.List('Subscription', {
	nocreate: true,
	noedit: true,
});

Subscription.add({
	email: { type: Types.Email, required: true },
	createdAt: { type: Date, default: Date.now },
});

Subscription.defaultSort = '-createdAt';
Subscription.defaultColumns = 'email, createdAt';
Subscription.register();
