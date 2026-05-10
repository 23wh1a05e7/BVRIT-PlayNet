const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  sport: { type: String, required: true },
  teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 },
  status: { type: String, enum: ['scheduled', 'live', 'completed', 'cancelled'], default: 'scheduled' },
  venue: { type: String },
  scheduledAt: { type: Date, required: true },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
