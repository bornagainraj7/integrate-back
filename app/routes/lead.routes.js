const express = require('express');
const LeadController = require('../controllers/lead.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('../middlewares/multer.middleware');

const router = express.Router();

router.post('/new', authMiddleware.isAuthorised, LeadController.newLead);

router.put('/update/:leadId', authMiddleware.isAuthorised, LeadController.updateLead);

router.get('/get', authMiddleware.isAuthorised, LeadController.getLeadsByUser);

router.get('/single/:leadId', authMiddleware.isAuthorised, LeadController.getSingleLead);

router.put('/update/docs/:leadId', authMiddleware.isAuthorised, multer.any(), LeadController.addDocs);

router.get('/count', authMiddleware.isAuthorised, LeadController.countLeadsByUser);


module.exports = router;
