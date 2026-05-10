const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate('teams', 'name sport logo')
      .populate('organizer', 'name')
      .sort({ startDate: -1 });
    res.json(tournaments);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const t = await Tournament.findById(req.params.id)
      .populate('teams', 'name sport logo wins losses points')
      .populate('organizer', 'name');
    if (!t) return res.status(404).json({ message: 'Tournament not found' });
    res.json(t);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const t = await Tournament.create({ ...req.body, organizer: req.user._id });
    res.status(201).json(t);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const t = await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(t);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/register', protect, async (req, res) => {
  try {
    const { teamId } = req.body;
    const t = await Tournament.findById(req.params.id);
    if (t.teams.length >= t.maxTeams) return res.status(400).json({ message: 'Tournament is full' });
    if (!t.teams.includes(teamId)) { t.teams.push(teamId); await t.save(); }
    res.json({ message: 'Team registered', tournament: t });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
