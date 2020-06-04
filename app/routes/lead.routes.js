const express = require('express');
const LeadController = require('../controllers/lead.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('../middlewares/multer.middleware');

const router = express.Router();


router.post('/new', authMiddleware.isAuthorised, LeadController.newLead);

router.post('/create/new/:userId', LeadController.leadWithoutToken);

router.put('/update/:leadId', authMiddleware.isAuthorised, LeadController.updateLead);

router.get('/get', authMiddleware.isAuthorised, LeadController.getLeadsByUser);

router.get('/single/:leadId', authMiddleware.isAuthorised, LeadController.getSingleLead);

router.put('/update/docs/:leadId', authMiddleware.isAuthorised, multer.any(), LeadController.addDocs);

router.get('/count', authMiddleware.isAuthorised, LeadController.countLeadsByUser);

router.get('/filter', authMiddleware.isAuthorised, LeadController.filterLead);

router.put('/comment/add/:leadId', authMiddleware.isAuthorised, LeadController.addComment);

module.exports = router;
