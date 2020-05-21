const express = require('express');
const LeadController = require('../controllers/lead.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/new', authMiddleware.isAuthorised, LeadController.newLead);

router.put('/update/:leadId', authMiddleware.isAuthorised, LeadController.updateLead);

router.get('/get', authMiddleware.isAuthorised, LeadController.getLeadsByUser);

router.get('/count', authMiddleware.isAuthorised, LeadController.countLeadsByUser);


module.exports = router;
