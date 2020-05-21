const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const ComplaintTypeController = require('../controllers/complaintType.controller');

const router = express.Router();


router.get('/getall', authMiddleware.isAuthorised, ComplaintTypeController.getAllComplaintTypes);


module.exports = router;
