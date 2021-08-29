'use strict';
var express = require('express');
var controller = require('./test.controller');
var router = express.Router();

router.post('/start', controller.start);
router.get('/run', controller.run);
router.get('/stop', controller.stop);

module.exports = router;