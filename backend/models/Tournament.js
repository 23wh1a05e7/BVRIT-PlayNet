const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name:                  { type: String, required: true },
  sport:                 { type: String, required: true },
  type:                  { type: String, enum: ['internal', 'inter-college'], default: 'internal' },
  description:           { type: String },
  hostCollege:           { type: String, default: 'BVRIT Hyderabad' },
  participatingColleges: [{ type: String }],
  startDate:             { type: Date, required: true },
  endDate:               { type: Date, required: true },
  venue:                 { type: String },
  status:                { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  teams:                 [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  organizer:             { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  maxTeams:              { type: Number, default: 8 },
  prize:                 { type: String },
  result:                { type: String, default: '' },
  banner:                { type: String, default: '' },
  registrationDeadline:  { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);
