const express = require('express');
let router = express.Router();

router.get('/', (req, res, next) => {
    res.body = 'Catetgories';
    next();
});

module.exports = router;