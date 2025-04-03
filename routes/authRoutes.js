//auth routes
const express = require('express');
const router = express.Router();
const { registerUser, verifyLogin, getAllUsers, getUserById, updateUserById, deleteUserById, loginRequest } = require('../controllers/UserManagementController/authController');


router.post('/register', registerUser);
router.post('/loginRequest', loginRequest);
router.post('/verifyLogin', verifyLogin);
router.get('getAllUsers', getAllUsers);
router.get('/getUserById/:id', getUserById);
router.patch('/updateUserById/:id', updateUserById);
router.patch('deleteUserById/:id', deleteUserById);

module.exports = router;