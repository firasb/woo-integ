const authentication = require('../middleware/authentication');

const items = require('./items');
const categories = require('./categories');

module.exports.attachTo = (app) => {
    app.use('/items', authentication.authenticate, items);
    app.use('/categories', authentication.authenticate, categories);
}