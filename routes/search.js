const express = require('express');

const router = express.Router();

const searchController = require('controllers/search');

router.get('/:keyword', searchController.getResult);

module.exports = router;
