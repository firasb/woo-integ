const express = require('express');
const services = require('../services');
let router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        let items = await services.WooCommerce.Items.getItems();
        res.body = items;
        next();
    }
    catch (ex) {
        next({
            code: 500,
            message: ex
        })
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        let item = await services.WooCommerce.Items.getItemDetails(req.params.id);
        res.body = item;
        next();
    }
    catch (ex) {
        next({
            code: 500,
            message: ex
        })
    }
});

module.exports = router;