const express = require('express');
const router = express.Router();
const { addUser, getAllUsers, getUserById, getUsersCount } = require('../controllers/userController');

router.post('/addUser', addUser);
router.get('/getAllUsers', getAllUsers);
router.get('/getUsersCount', getUsersCount); 
router.get('/:id', getUserById);           

module.exports = router;
