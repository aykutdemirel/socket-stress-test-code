'use strict';
var express = require('express');
var controller = require('./test.controller');
var router = express.Router();

router.post('/start', controller.start);
router.post('/run', controller.run);
router.get('/stop', controller.stop);
router.get('/stopReq', controller.stopReq);
router.post('/startArtilleryInit', controller.startArtilleryInit);
router.post('/runArtillery', controller.runArtillery);

module.exports = router;