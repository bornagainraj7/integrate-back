const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const InsuranceCompanyController = require('../controllers/insuranceCompany.controller');

const router = express.Router();


router.get('/getall', authMiddleware.isAuthorised, InsuranceCompanyController.getAllInsuranceCompaies);


module.exports = router;
