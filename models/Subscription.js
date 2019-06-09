const keystone = require('keystone');
const Types = keystone.Field.Types;

const Subscription = new keystone.List('Subscription', {
	nocreate: true,
	noedit: true,
	map: { name: 'email' }
});

Subscription.add({
	email: { type: Types.Email, required: true },
	createdAt: { type: Date, default: Date.now },
});

Subscription.defaultSort = '-createdAt';
Subscription.defaultColumns = 'email, createdAt';
Subscription.register();
