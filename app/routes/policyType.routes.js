const express = require('express');
const PolicyTypeController = require('../controllers/policyType.controller');

const router = express.Router();


router.get('/getall', PolicyTypeController.getAllPolicyTypes);


module.exports = router;
