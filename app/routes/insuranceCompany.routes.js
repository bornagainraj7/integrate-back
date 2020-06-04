const express = require('express');
const InsuranceCompanyController = require('../controllers/insuranceCompany.controller');

const router = express.Router();


router.get('/getall', InsuranceCompanyController.getAllInsuranceCompaies);


module.exports = router;
