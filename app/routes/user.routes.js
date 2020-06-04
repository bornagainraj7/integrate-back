const express = require('express');
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const profile = require('../middlewares/profile.middleware');

const router = express.Router();


router.get('/:userId', UserController.getSingleUser);

router.put('/update', authMiddleware.isAuthorised, UserController.updateProfile);

router.put('/profilepic', authMiddleware.isAuthorised, profile.any(), UserController.updateProfilePic);

module.exports = router;
