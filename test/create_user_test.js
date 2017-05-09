const assert = require('assert');
const User = require('../models/user');

describe('Creating a user record', () => {
    it('creates a user', () => {
        const joe = new User({
            firstName: 'Johny',
            lastName: 'Bravo',
            email: 'joe@gmail.com',
            password: 'password'
        });

        joe.save()
            .then(() => {
                assert(!joe.isNew);
                done();
            });
    });
});