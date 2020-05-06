const express = require('express');

const router = express.Router();

const companyController = require('../controllers/company');

router.get('/', companyController.getAllCompanies);
router.get('/:id', companyController.getCompany);

module.exports = router;
