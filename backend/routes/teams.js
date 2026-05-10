const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { protect, adminOnly } = require('../middleware/auth');

// GET all teams
router.get('/', async (req, res) => {
  try {
    const { sport } = req.query;
    const filter = sport ? { sport, isActive: true } : { isActive: true };
    const teams = await Team.find(filter).populate('captain', 'name email').populate('members', 'name email department');
    res.json(teams);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single team
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('captain members', 'name email department year');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create team
router.post('/', protect, async (req, res) => {
  try {
    const team = await Team.create({ ...req.body, captain: req.user._id });
    res.status(201).json(team);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update team
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(team);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST join team
router.post('/:id/join', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.members.includes(req.user._id)) return res.status(400).json({ message: 'Already a member' });
    team.members.push(req.user._id);
    await team.save();
    res.json({ message: 'Joined team successfully', team });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE team
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Team.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Team deactivated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
