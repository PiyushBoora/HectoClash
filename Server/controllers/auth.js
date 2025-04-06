const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const setCookie = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_KEY, {
      expiresIn: '15d'
    });

    res.cookie('jwt', token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
  } catch (error) {
    console.log(error);
  }
};

const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

const googleCallback = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }, (err, user) => {
    if (err || !user) {
      return res.redirect('http://localhost:5173/login');
    }
    console.log(user);
    setCookie(user._id, res);

    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect('http://localhost:5173/dashboard');
    });
  })(req, res, next);
};

const getMe = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({success: false, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const userId = decoded.userId;
 
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({success: false, message: 'User not found' });
    } 

    res.status(200).json({success: true, user});
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(403).json({ message: 'Invalid token' });
  }
};

const signOut = async (req, res) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    req.logout(() => {
      res.status(200).json({ success: true, message: 'Successfully signed out' });
    });
  } catch (error) {
    console.error('Error signing out:', error);
    res.status(500).json({ success: false, message: 'Error signing out' });
  }
};

module.exports = {
  setCookie,
  getMe,
  googleAuth,
  googleCallback,
  signOut
};