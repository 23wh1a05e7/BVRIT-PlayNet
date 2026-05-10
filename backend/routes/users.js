const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET leaderboard by sport
router.get('/leaderboard', async (req, res) => {
  try {
    const { sport } = req.query;
    const filter = sport ? { sport, isActive: true } : { isActive: true };
    const teams = await Team.find(filter)
      .select('name sport wins losses draws points logo')
      .sort({ points: -1, wins: -1 });
    res.json(teams);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET all students
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password').sort({ name: 1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET user profile
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, department, year, phone, sports } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, department, year, phone, sports }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
