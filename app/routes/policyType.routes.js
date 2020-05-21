const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const PolicyTypeController = require('../controllers/policyType.controller');

const router = express.Router();

router.get('/getall', authMiddleware.isAuthorised, PolicyTypeController.getAllPolicyTypes);

module.exports = router;
