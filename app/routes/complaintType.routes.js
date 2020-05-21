const express = require('express');
const ComplaintTypeController = require('../controllers/complaintType.controller');

const router = express.Router();


router.get('/get/:policyTypeId', ComplaintTypeController.getComplaintTypes);

module.exports = router;
