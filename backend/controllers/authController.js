const User = require('../models/User');
const Booking = require('../models/Booking'); // <-- Import the Booking model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4. Send back user data and token
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check for user email
    const user = await User.findOne({ email });

    // 2. Check password
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user data and dashboard stats
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Count total workouts
    const totalWorkouts = await Booking.countDocuments({ user: userId });

    // 2. Find the most recent booking for "Up Next"
    const nextBooking = await Booking.findOne({ user: userId }).sort({ createdAt: -1 });

    // 3. Find the 3 most recent bookings for the table
    const recentBookings = await Booking.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(3);

    // 4. Send it all back to React
    res.status(200).json({
      user: req.user,
      stats: {
        workoutsThisMonth: totalWorkouts,
        trainingTime: (totalWorkouts * 0.75).toFixed(1), // Estimates 45 mins per class
        streak: totalWorkouts > 0 ? 1 : 0,
        goal: 16
      },
      nextBooking: nextBooking,
      recentBookings: recentBookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getMe };