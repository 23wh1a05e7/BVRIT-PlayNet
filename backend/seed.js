const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User         = require('./models/User');
const Team         = require('./models/Team');
const Match        = require('./models/Match');
const Tournament   = require('./models/Tournament');
const Announcement = require('./models/Announcement');

// ── Constants ─────────────────────────────────────────────
const SPORTS = [
  'Throwball', 'Volleyball', 'Basketball', 'Kho-Kho',
  'Table Tennis', 'Badminton', 'Pickleball', 'Carrom'
];

const BRANCHES = ['CSE', 'CSE-AIML', 'EEE', 'ECE'];

const SPORT_EMOJI = {
  Throwball: '🏐', Volleyball: '🏐', Basketball: '🏀',
  'Kho-Kho': '🏃', 'Table Tennis': '🏓', Badminton: '🏸',
  Pickleball: '🏓', Carrom: '🎯'
};

const HYDERABAD_COLLEGES = [
  'CBIT Hyderabad', 'MGIT Hyderabad', 'VNR VJIET', 'JNTUH', 
  'Osmania University', 'Vasavi College', 'MVSR Engineering',
  'Stanley College', 'Bhavan\'s Vivekananda College', 'St. Francis College',
  'Aurora Engineering College', 'Malla Reddy Engineering'
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('🌱 Seeding BVRIT PlayNet database...\n');

  await User.deleteMany();
  await Team.deleteMany();
  await Match.deleteMany();
  await Tournament.deleteMany();
  await Announcement.deleteMany();

  // ── USERS ─────────────────────────────────────────────────
  const admin = await User.create({
    name: 'Dr. Padmavathi Manthri', email: 'admin@bvrit.ac.in',
    password: 'admin123', role: 'admin', department: 'Physical Education'
  });

  const faculty = await User.create({
    name: 'Prof. Kavitha Reddy', email: 'faculty@bvrit.ac.in',
    password: 'faculty123', role: 'faculty', department: 'Sports'
  });

  const students = await User.insertMany([
    { name: 'Ananya Sharma',    email: 'ananya@bvrit.ac.in',    password: 'student123', role: 'student', rollNumber: '21BQ1A0501', department: 'CSE',      year: '3rd', sports: ['Throwball','Badminton'] },
    { name: 'Priya Reddy',      email: 'priya@bvrit.ac.in',     password: 'student123', role: 'student', rollNumber: '21BQ1A0502', department: 'CSE',      year: '3rd', sports: ['Volleyball','Kho-Kho'] },
    { name: 'Divya Nair',       email: 'divya@bvrit.ac.in',     password: 'student123', role: 'student', rollNumber: '21BQ1A0503', department: 'CSE',      year: '3rd', sports: ['Basketball','Table Tennis'] },
    { name: 'Lakshmi Prasad',   email: 'lakshmi@bvrit.ac.in',   password: 'student123', role: 'student', rollNumber: '22BQ1A0501', department: 'CSE-AIML', year: '2nd', sports: ['Throwball','Pickleball'] },
    { name: 'Sneha Kulkarni',   email: 'sneha@bvrit.ac.in',     password: 'student123', role: 'student', rollNumber: '22BQ1A0502', department: 'CSE-AIML', year: '2nd', sports: ['Badminton','Carrom'] },
    { name: 'Meghana Patil',    email: 'meghana@bvrit.ac.in',   password: 'student123', role: 'student', rollNumber: '22BQ1A0601', department: 'EEE',      year: '2nd', sports: ['Volleyball','Throwball'] },
    { name: 'Kavya Srinivas',   email: 'kavya@bvrit.ac.in',     password: 'student123', role: 'student', rollNumber: '22BQ1A0701', department: 'ECE',      year: '2nd', sports: ['Kho-Kho','Basketball'] },
    { name: 'Pooja Verma',      email: 'pooja@bvrit.ac.in',     password: 'student123', role: 'student', rollNumber: '23BQ1A0501', department: 'CSE',      year: '1st', sports: ['Table Tennis','Carrom'] },
    { name: 'Ritu Agarwal',     email: 'ritu@bvrit.ac.in',      password: 'student123', role: 'student', rollNumber: '23BQ1A0502', department: 'CSE-AIML', year: '1st', sports: ['Pickleball','Badminton'] },
    { name: 'Sravani Devi',     email: 'sravani@bvrit.ac.in',   password: 'student123', role: 'student', rollNumber: '21BQ1A0601', department: 'EEE',      year: '3rd', sports: ['Throwball','Volleyball'] },
    { name: 'Harshitha Rao',    email: 'harshitha@bvrit.ac.in', password: 'student123', role: 'student', rollNumber: '21BQ1A0701', department: 'ECE',      year: '3rd', sports: ['Basketball','Carrom'] },
    { name: 'Bhavana Reddy',    email: 'bhavana@bvrit.ac.in',   password: 'student123', role: 'student', rollNumber: '22BQ1A0702', department: 'ECE',      year: '2nd', sports: ['Kho-Kho','Table Tennis'] },
  ]);

  console.log(`✅ Created ${students.length + 2} users\n`);

  // ── TEAMS ─────────────────────────────────────────────────
  const teams = await Team.insertMany([
    // Throwball
    { name: 'CSE Smashers',     sport: 'Throwball',    captain: students[0]._id, members: [students[0]._id, students[3]._id, students[9]._id], coach: 'Prof. Kavitha Reddy', wins: 8, losses: 2, draws: 0, points: 24, description: 'CSE Throwball Team' },
    { name: 'ECE Spikers',      sport: 'Throwball',    captain: students[6]._id, members: [students[6]._id, students[11]._id], wins: 6, losses: 4, draws: 0, points: 18 },
    // Volleyball
    { name: 'CSE-AIML Setters', sport: 'Volleyball',   captain: students[5]._id, members: [students[5]._id, students[1]._id, students[9]._id], wins: 7, losses: 3, draws: 1, points: 22 },
    { name: 'EEE Blockers',     sport: 'Volleyball',   captain: students[5]._id, members: [students[5]._id], wins: 5, losses: 4, draws: 1, points: 16 },
    // Basketball
    { name: 'CSE Hoopsters',    sport: 'Basketball',   captain: students[2]._id, members: [students[2]._id, students[6]._id, students[10]._id], wins: 9, losses: 1, draws: 0, points: 27 },
    { name: 'ECE Eagles',       sport: 'Basketball',   captain: students[10]._id, members: [students[10]._id, students[6]._id], wins: 4, losses: 6, draws: 0, points: 12 },
    // Kho-Kho
    { name: 'CSE Chasers',      sport: 'Kho-Kho',      captain: students[1]._id, members: [students[1]._id, students[6]._id, students[11]._id], wins: 6, losses: 2, draws: 2, points: 20 },
    { name: 'EEE Runners',      sport: 'Kho-Kho',      captain: students[11]._id, members: [students[11]._id], wins: 4, losses: 4, draws: 2, points: 14 },
    // Table Tennis
    { name: 'CSE Pingsters',    sport: 'Table Tennis', captain: students[2]._id, members: [students[2]._id, students[7]._id], wins: 10, losses: 2, draws: 0, points: 30 },
    { name: 'CSE-AIML Spinners',sport: 'Table Tennis', captain: students[4]._id, members: [students[4]._id, students[8]._id], wins: 7, losses: 5, draws: 0, points: 21 },
    // Badminton
    { name: 'CSE Shuttlers',    sport: 'Badminton',    captain: students[0]._id, members: [students[0]._id, students[4]._id], wins: 8, losses: 3, draws: 0, points: 24 },
    { name: 'ECE Smashers',     sport: 'Badminton',    captain: students[8]._id, members: [students[8]._id], wins: 5, losses: 6, draws: 0, points: 15 },
    // Pickleball
    { name: 'CSE-AIML Picklers',sport: 'Pickleball',   captain: students[3]._id, members: [students[3]._id, students[8]._id], wins: 6, losses: 2, draws: 1, points: 19 },
    { name: 'EEE Dinksters',    sport: 'Pickleball',   captain: students[9]._id, members: [students[9]._id], wins: 4, losses: 4, draws: 1, points: 13 },
    // Carrom
    { name: 'CSE Board Queens', sport: 'Carrom',       captain: students[7]._id, members: [students[7]._id, students[4]._id, students[10]._id], wins: 11, losses: 1, draws: 0, points: 33 },
    { name: 'ECE Strikers',     sport: 'Carrom',       captain: students[11]._id, members: [students[11]._id], wins: 6, losses: 6, draws: 0, points: 18 },
  ]);

  console.log(`✅ Created ${teams.length} teams\n`);

  // ── INTERNAL MATCHES ──────────────────────────────────────
  const now = new Date();
  const matches = await Match.insertMany([
    // Throwball - live
    { sport: 'Throwball',    teamA: teams[0]._id, teamB: teams[1]._id, scoreA: 12, scoreB: 8,  status: 'live',      venue: 'BVRIT Indoor Court', scheduledAt: new Date() },
    // Volleyball - completed
    { sport: 'Volleyball',   teamA: teams[2]._id, teamB: teams[3]._id, scoreA: 25, scoreB: 18, status: 'completed', venue: 'BVRIT Volleyball Court', scheduledAt: new Date(now - 3*86400000), winner: teams[2]._id },
    // Basketball - completed
    { sport: 'Basketball',   teamA: teams[4]._id, teamB: teams[5]._id, scoreA: 48, scoreB: 32, status: 'completed', venue: 'BVRIT Basketball Court', scheduledAt: new Date(now - 5*86400000), winner: teams[4]._id },
    // Kho-Kho - scheduled
    { sport: 'Kho-Kho',      teamA: teams[6]._id, teamB: teams[7]._id, scoreA: 0,  scoreB: 0,  status: 'scheduled', venue: 'BVRIT Outdoor Ground',   scheduledAt: new Date(now + 2*86400000) },
    // Table Tennis - live
    { sport: 'Table Tennis', teamA: teams[8]._id, teamB: teams[9]._id, scoreA: 2,  scoreB: 1,  status: 'live',      venue: 'BVRIT TT Room',          scheduledAt: new Date() },
    // Badminton - completed
    { sport: 'Badminton',    teamA: teams[10]._id, teamB: teams[11]._id, scoreA: 21, scoreB: 15, status: 'completed', venue: 'BVRIT Badminton Court', scheduledAt: new Date(now - 2*86400000), winner: teams[10]._id },
    // Pickleball - scheduled
    { sport: 'Pickleball',   teamA: teams[12]._id, teamB: teams[13]._id, scoreA: 0,  scoreB: 0,  status: 'scheduled', venue: 'BVRIT Pickleball Court', scheduledAt: new Date(now + 3*86400000) },
    // Carrom - completed
    { sport: 'Carrom',       teamA: teams[14]._id, teamB: teams[15]._id, scoreA: 29, scoreB: 18, status: 'completed', venue: 'BVRIT Indoor Hall', scheduledAt: new Date(now - 1*86400000), winner: teams[14]._id },
  ]);

  console.log(`✅ Created ${matches.length} internal matches\n`);

  // ── TOURNAMENTS (Inter-College Hyderabad) ─────────────────
  const tournaments = await Tournament.insertMany([
    // Inter-college tournaments hosted by other colleges
    {
      name: 'CBIT Sports Fest 2024 — Throwball',
      sport: 'Throwball', type: 'inter-college',
      description: 'Annual inter-college throwball tournament hosted by CBIT Hyderabad. BVRIT participated and reached semi-finals.',
      hostCollege: 'CBIT Hyderabad',
      startDate: new Date('2024-01-15'), endDate: new Date('2024-01-17'),
      venue: 'CBIT Indoor Sports Complex, Gandipet, Hyderabad',
      status: 'completed', teams: [teams[0]._id],
      organizer: admin._id, maxTeams: 16,
      prize: 'Runner-up Trophy',
      result: 'Runner-up 🥈',
      participatingColleges: ['BVRIT', 'CBIT', 'MGIT', 'VNR VJIET', 'Vasavi College', 'Stanley College'],
      registrationDeadline: new Date('2024-01-10'),
    },
    {
      name: 'JNTUH Women\'s Volleyball Championship',
      sport: 'Volleyball', type: 'inter-college',
      description: 'Prestigious JNTUH affiliated women\'s volleyball tournament. BVRIT team won the championship!',
      hostCollege: 'JNTUH',
      startDate: new Date('2024-02-05'), endDate: new Date('2024-02-08'),
      venue: 'JNTUH Sports Ground, Kukatpally, Hyderabad',
      status: 'completed', teams: [teams[2]._id],
      organizer: admin._id, maxTeams: 12,
      prize: '₹15,000 + Champion Trophy',
      result: 'Champions 🏆',
      participatingColleges: ['BVRIT', 'JNTUH', 'Osmania University', 'MGIT', 'Bhavan\'s Vivekananda', 'Aurora Engineering'],
      registrationDeadline: new Date('2024-02-01'),
    },
    {
      name: 'VNR VJIET Sports Meet — Basketball',
      sport: 'Basketball', type: 'inter-college',
      description: 'Inter-college basketball tournament at VNR VJIET. BVRIT Hoopsters won all group stage matches.',
      hostCollege: 'VNR VJIET',
      startDate: new Date('2024-02-20'), endDate: new Date('2024-02-22'),
      venue: 'VNR VJIET Basketball Court, Bachupally, Hyderabad',
      status: 'completed', teams: [teams[4]._id],
      organizer: admin._id, maxTeams: 8,
      prize: 'Champions Trophy + Medals',
      result: 'Champions 🏆',
      participatingColleges: ['BVRIT', 'VNR VJIET', 'CBIT', 'Malla Reddy Engineering', 'MVSR', 'Stanley College'],
      registrationDeadline: new Date('2024-02-15'),
    },
    {
      name: 'Osmania University Kho-Kho League',
      sport: 'Kho-Kho', type: 'inter-college',
      description: 'Traditional Kho-Kho tournament organized by Osmania University. High-energy matches across 3 days.',
      hostCollege: 'Osmania University',
      startDate: new Date('2024-03-01'), endDate: new Date('2024-03-03'),
      venue: 'Osmania University Stadium, Hyderabad',
      status: 'completed', teams: [teams[6]._id],
      organizer: admin._id, maxTeams: 10,
      prize: '3rd Place Trophy 🥉',
      result: '3rd Place 🥉',
      participatingColleges: ['BVRIT', 'Osmania University', 'JNTUH', 'Vasavi College', 'Aurora Engineering'],
      registrationDeadline: new Date('2024-02-25'),
    },
    {
      name: 'MGIT Table Tennis Open 2024',
      sport: 'Table Tennis', type: 'inter-college',
      description: 'Inter-college Table Tennis open championship. BVRIT Pingsters dominated with 5 consecutive wins.',
      hostCollege: 'MGIT Hyderabad',
      startDate: new Date('2024-03-10'), endDate: new Date('2024-03-11'),
      venue: 'MGIT Indoor Hall, Gandipet, Hyderabad',
      status: 'completed', teams: [teams[8]._id],
      organizer: admin._id, maxTeams: 20,
      prize: 'Champions Trophy + ₹5,000',
      result: 'Champions 🏆',
      participatingColleges: ['BVRIT', 'MGIT', 'VNR VJIET', 'CBIT', 'Vasavi College', 'Stanley College', 'Bhavan\'s Vivekananda'],
      registrationDeadline: new Date('2024-03-05'),
    },
    {
      name: 'Vasavi College Badminton Tournament',
      sport: 'Badminton', type: 'inter-college',
      description: 'Women\'s badminton inter-college tournament hosted by Vasavi College of Engineering.',
      hostCollege: 'Vasavi College of Engineering',
      startDate: new Date('2024-04-05'), endDate: new Date('2024-04-06'),
      venue: 'Vasavi College Indoor Court, Ibrahimbagh, Hyderabad',
      status: 'completed', teams: [teams[10]._id],
      organizer: admin._id, maxTeams: 12,
      prize: 'Runner-up Trophy 🥈',
      result: 'Runner-up 🥈',
      participatingColleges: ['BVRIT', 'Vasavi College', 'Stanley College', 'MGIT', 'CBIT', 'Aurora Engineering'],
      registrationDeadline: new Date('2024-04-01'),
    },
    // BVRIT hosted internal tournament
    {
      name: 'BVRIT Annual Sports Meet 2024',
      sport: 'Throwball', type: 'internal',
      description: 'BVRIT\'s flagship annual inter-department sports event. All 4 departments compete across all 8 sports over 5 days. Grand prizes and trophies for winners!',
      hostCollege: 'BVRIT Hyderabad',
      startDate: new Date('2024-11-01'), endDate: new Date('2024-11-05'),
      venue: 'BVRIT Hyderabad Sports Complex',
      status: 'upcoming', teams: [teams[0]._id, teams[1]._id, teams[2]._id, teams[3]._id],
      organizer: admin._id, maxTeams: 8,
      prize: 'Overall Champions Trophy + ₹10,000',
      result: '',
      participatingColleges: ['BVRIT'],
      registrationDeadline: new Date('2024-10-20'),
    },
    // Upcoming inter-college
    {
      name: 'Stanley College Women\'s Sports Fest 2024',
      sport: 'Volleyball', type: 'inter-college',
      description: 'Upcoming inter-college women\'s sports fest at Stanley College. BVRIT has registered for Volleyball and Throwball events.',
      hostCollege: 'Stanley College for Women',
      startDate: new Date('2024-12-10'), endDate: new Date('2024-12-12'),
      venue: 'Stanley College Grounds, Abids, Hyderabad',
      status: 'upcoming', teams: [teams[2]._id],
      organizer: admin._id, maxTeams: 10,
      prize: 'Trophy + Certificates',
      result: '',
      participatingColleges: ['BVRIT', 'Stanley College', 'CBIT', 'Bhavan\'s Vivekananda', 'Osmania University'],
      registrationDeadline: new Date('2024-12-01'),
    },
  ]);

  console.log(`✅ Created ${tournaments.length} tournaments\n`);

  // ── ANNOUNCEMENTS ──────────────────────────────────────────
  await Announcement.insertMany([
    {
      title: '🏆 BVRIT Annual Sports Meet 2024 — Registrations Open!',
      content: 'The most awaited event of the year is here! BVRIT Annual Sports Meet 2024 will be held from November 1–5. All 8 sports: Throwball, Volleyball, Basketball, Kho-Kho, Table Tennis, Badminton, Pickleball, and Carrom. All 4 branches — CSE, CSE-AIML, EEE, ECE — register your teams before October 20th!',
      author: admin._id, priority: 'high', sport: 'all', isPinned: true
    },
    {
      title: '🥈 BVRIT wins Runner-up at CBIT Throwball Tournament!',
      content: 'Congratulations to our CSE Smashers for winning the Runner-up position at CBIT Sports Fest 2024 Throwball Tournament held at Gandipet, Hyderabad. The team played brilliantly across 3 days. Special appreciation to team captain Ananya Sharma!',
      author: admin._id, priority: 'high', sport: 'Throwball', isPinned: true
    },
    {
      title: '🏆 BVRIT Champions at JNTUH Women\'s Volleyball Championship!',
      content: 'Our CSE-AIML Setters team has won the JNTUH Women\'s Volleyball Championship 2024! They defeated 5 teams from across Hyderabad and brought home the trophy and ₹15,000 prize money. Pride of BVRIT!',
      author: faculty._id, priority: 'high', sport: 'Volleyball', isPinned: false
    },
    {
      title: '📅 Throwball Practice — Indoor Court, Daily 5:30 AM',
      content: 'All Throwball team members must attend daily morning practice sessions at the BVRIT Indoor Court from 5:30 AM to 7:00 AM. Attendance is mandatory for all players registered in the Annual Sports Meet.',
      author: faculty._id, priority: 'medium', sport: 'Throwball', isPinned: false
    },
    {
      title: '🏓 New Table Tennis Tables Installed!',
      content: 'Two new Table Tennis tables have been installed in the BVRIT TT Room. Practice sessions are available Monday to Saturday from 4:00 PM to 6:00 PM. First come first served basis.',
      author: admin._id, priority: 'medium', sport: 'Table Tennis', isPinned: false
    },
    {
      title: '🏸 Badminton Selections for Stanley College Fest',
      content: 'Selections for the Stanley College Women\'s Sports Fest (December 10–12) Badminton team will be held on November 15th at BVRIT Badminton Court. All interested students from CSE, CSE-AIML, EEE, ECE are welcome.',
      author: faculty._id, priority: 'medium', sport: 'Badminton', isPinned: false
    },
    {
      title: '🎯 Carrom Tournament — All Branches Welcome',
      content: 'Inter-department Carrom tournament starting next week. Individual and doubles categories available. Register with your respective department sports representative before October 25th.',
      author: admin._id, priority: 'low', sport: 'Carrom', isPinned: false
    },
    {
      title: '🏃 Kho-Kho Match vs EEE Runners — Sunday 8 AM',
      content: 'CSE Chasers vs EEE Runners Kho-Kho match scheduled for this Sunday 8:00 AM at the BVRIT Outdoor Ground. All students are welcome to cheer for their teams. Come show your support!',
      author: faculty._id, priority: 'low', sport: 'Kho-Kho', isPinned: false
    },
  ]);

  console.log('✅ Created 8 announcements\n');
  console.log('============================================');
  console.log('  BVRIT PlayNet — Database Seeded!');
  console.log('============================================');
  console.log('\n🏫 College: BVRIT Hyderabad College of Engineering for Women');
  console.log('\n🏅 Sports:', SPORTS.join(', '));
  console.log('\n🎓 Branches:', BRANCHES.join(', '));
  console.log('\n📧 Login Credentials:');
  console.log('  Admin   : admin@bvrit.ac.in   / admin123');
  console.log('  Faculty : faculty@bvrit.ac.in / faculty123');
  console.log('  Student : ananya@bvrit.ac.in  / student123');
  console.log('\n🏆 Inter-College Tournaments seeded:');
  console.log('  CBIT, JNTUH, VNR VJIET, Osmania Univ, MGIT, Vasavi, Stanley College');

  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
