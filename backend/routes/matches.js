const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Team = require('../models/Team');
const { protect, adminOnly } = require('../middleware/auth');

// GET all matches
router.get('/', async (req, res) => {
  try {
    const { status, sport } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (sport) filter.sport = sport;
    const matches = await Match.find(filter)
      .populate('teamA teamB', 'name sport logo')
      .populate('winner', 'name')
      .sort({ scheduledAt: -1 });
    res.json(matches);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET live matches
router.get('/live', async (req, res) => {
  try {
    const matches = await Match.find({ status: 'live' })
      .populate('teamA teamB', 'name sport logo');
    res.json(matches);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single match
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('teamA teamB', 'name sport logo members')
      .populate('attendees', 'name');
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.json(match);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST schedule match
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json(match);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update match score
router.put('/:id/score', protect, adminOnly, async (req, res) => {
  try {
    const { scoreA, scoreB, status } = req.body;
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    match.scoreA = scoreA ?? match.scoreA;
    match.scoreB = scoreB ?? match.scoreB;
    if (status) match.status = status;
    if (status === 'completed') {
      if (scoreA > scoreB) match.winner = match.teamA;
      else if (scoreB > scoreA) match.winner = match.teamB;
      // Update team stats
      const teamA = await Team.findById(match.teamA);
      const teamB = await Team.findById(match.teamB);
      if (scoreA > scoreB) { teamA.wins++; teamA.points += 3; teamB.losses++; }
      else if (scoreB > scoreA) { teamB.wins++; teamB.points += 3; teamA.losses++; }
      else { teamA.draws++; teamB.draws++; teamA.points++; teamB.points++; }
      await teamA.save(); await teamB.save();
    }
    await match.save();
    res.json(match);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST mark attendance
router.post('/:id/attend', protect, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match.attendees.includes(req.user._id)) {
      match.attendees.push(req.user._id);
      await match.save();
    }
    res.json({ message: 'Attendance marked', attendees: match.attendees.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
