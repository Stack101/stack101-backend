const express = require('express');

const router = express.Router();

const aggregateController = require('../controllers/statistics');

router.get('/', aggregateController.getResult);

module.exports = router;
