const User=require('../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Cookie setter
 const setCookie = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_KEY, {
      expiresIn: '15d'
    });

    res.cookie('jwt', token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // 
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
  } catch (error) {
    console.log(error);
  }
};


// ===========================
// Google Auth Controllers
// ===========================

// Trigger Google OAuth Login (redirects to Google consent screen)
 const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

// Handle Google Callback after authentication
 const googleCallback = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }, (err, user) => {
    if (err || !user) {
      return res.redirect('http://localhost:5173/login');
    }
    console.log(user);
    // Set cookie with MongoDB userId
    setCookie(user._id, res);

    // Optional: you can also log the user in via session if needed
    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect('http://localhost:5173/dashboard');
    });
  })(req, res, next);
};

 const getMe=async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({success:false, message: 'Unauthorized' });
    }

    // Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const userId = decoded.userId;
 
    // Fetch user data from the database (optional)
    const user = await User.findById(userId).select('-password'); // Exclude sensitive fields
    if (!user) {
      return res.status(404).json({success:false, message: 'User not found' });
    } 

    res.status(200).json({success:true,user}); // Send user data to the frontend
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(403).json({ message: 'Invalid token' });
  }
} 


module.exports={setCookie,getMe,googleAuth,googleCallback}