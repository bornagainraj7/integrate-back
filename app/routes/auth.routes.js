const express = require('express');
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();


router.post('/signup', AuthController.signupUser);

router.post('/login', AuthController.loginUser);

router.get('/verify/:token', authMiddleware.verifyFirstTime, AuthController.verifyUser);

module.exports = router;