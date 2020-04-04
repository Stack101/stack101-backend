const express = require('express');

const router = express.Router();

const stackController = require('controllers/stack');

router.get('/', stackController.getAllStacks);
router.get('/:id', stackController.getStack);

module.exports = router;
