const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Please provide firstName, lastName, email, and password' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({
      firstName,
      lastName,
      email,
      password,
      phone: { number: phone || '', verified: false }
    });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key');
    res.json({
      token,
      user: {
        id: user._id,
        firstName,
        lastName,
        email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Increment login attempts for security
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) {
        user.lockoutUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
      }
      await user.save();
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockoutUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key');
    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
