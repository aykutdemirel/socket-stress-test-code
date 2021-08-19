'use strict';
var express = require('express');
var controller = require('./test.controller');
var router = express.Router();

router.get('/start', controller.start);
router.get('/stop', controller.stop);

module.exports = router;