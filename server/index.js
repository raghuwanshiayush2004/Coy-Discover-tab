const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { makeProfiles } = require('./seed');

const FILE = path.join(__dirname, 'data', 'db.json');
const fresh = () => ({ profiles: makeProfiles(), swipes: {}, matches: [] });
const save = (db) => { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(db, null, 2)); };
const load = () => { if (!fs.existsSync(FILE)) save(fresh()); return JSON.parse(fs.readFileSync(FILE, 'utf8')); };
// likedMe is private: it must NEVER leave the server
const pub = ({ likedMe, ...p }) => p;

const router = express.Router();

// Profiles the user hasn't swiped on yet
router.get('/feed', (req, res) => {
  const db = load();
  res.json(db.profiles.filter((p) => !(p.id in db.swipes)).map(pub));
});

// Record like/pass; matched only if the other person already liked us
router.post('/swipe', (req, res) => {
  const { profileId, direction } = req.body || {};
  if (!['like', 'pass'].includes(direction)) return res.status(400).json({ error: 'direction must be "like" or "pass"' });
  const db = load();
  const profile = db.profiles.find((p) => p.id === Number(profileId));
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  if (profile.id in db.swipes) // already swiped: idempotent, never double-count
    return res.json({ matched: db.matches.includes(profile.id), alreadySwiped: true, profile: pub(profile) });

  db.swipes[profile.id] = direction;
  const matched = direction === 'like' && profile.likedMe;
  if (matched) db.matches.push(profile.id);
  save(db);
  res.json({ matched, profile: pub(profile) });
});

router.get('/matches', (req, res) => {
  const db = load();
  res.json(db.matches.map((id) => pub(db.profiles.find((p) => p.id === id))));
});

// Demo helper: start over
router.post('/reset', (req, res) => { save(fresh()); res.json({ ok: true }); });

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use('/', router); // also available as plain /feed, /swipe, /matches
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Coy API on http://localhost:${PORT}`));
