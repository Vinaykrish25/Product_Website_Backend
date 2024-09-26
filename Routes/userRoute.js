const express = require('express');
const { 
    getAllUser, 
    registerUser, 
    loginUser, 
    verifyUser, 
    logoutUser, 
    verifyAdmin
} = require('../Controllers/userController');


// Create router for users
const userRouter = express.Router();

// Route to get all users (restricted to admins)
userRouter.get('/', getAllUser);

// Route to register a new user
userRouter.post('/register', registerUser);

// Route to log in a user
userRouter.post('/login', loginUser);

// Route to verify JWT token and user session
userRouter.post('/verify', verifyUser);

// Route to log out a user
userRouter.post('/logout', logoutUser);

// Route to verify JWT token and admin session
userRouter.post('/verifyadmin', verifyAdmin);

module.exports = userRouter;
