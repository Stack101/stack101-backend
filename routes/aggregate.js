const express = require('express');

const router = express.Router();

const aggregateController = require('controllers/aggregate');

router.get('/', aggregateController.getResult);

module.exports = router;
