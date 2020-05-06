const express = require('express');

const router = express.Router();

const testController = require('../controllers/test');

router.get('/', testController.testGet);
router.post('/', testController.testPost);

module.exports = router;
