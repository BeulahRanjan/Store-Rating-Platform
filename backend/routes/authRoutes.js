
const express = require('express');
const router = express.Router();
const { signup, login, updatePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.put('/update-password', auth, updatePassword);

module.exports = router;
