const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@satellite.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync(ADMIN_PASSWORD, 10);

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeUsers(users) {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const users = readUsers();
  const lower = email.toLowerCase();
  if (users.some((u) => u.email.toLowerCase() === lower)) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  if (lower === ADMIN_EMAIL.toLowerCase()) {
    return res.status(400).json({ error: 'Email reserved' });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now().toString(36),
    email: lower,
    passwordHash: hash,
    name: name || email.split('@')[0],
    createdAt: new Date().toISOString(),
    role: 'user',
  };
  users.push(user);
  writeUsers(users);

  const token = jwt.sign(
    { email: user.email, role: user.role, id: user.id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.status(201).json({
    token,
    user: { email: user.email, name: user.name, role: user.role, id: user.id },
    expiresIn: 7 * 24 * 60 * 60,
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const lower = email.toLowerCase();

  if (lower === ADMIN_EMAIL.toLowerCase()) {
    const validPass = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!validPass) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { email: ADMIN_EMAIL, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.json({
      token,
      user: { email: ADMIN_EMAIL, name: 'Admin', role: 'admin' },
      expiresIn: 7 * 24 * 60 * 60,
    });
  }

  const users = readUsers();
  const user = users.find((u) => u.email.toLowerCase() === lower);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { email: user.email, role: user.role, id: user.id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({
    token,
    user: { email: user.email, name: user.name, role: user.role, id: user.id },
    expiresIn: 7 * 24 * 60 * 60,
  });
});

router.post('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    if (decoded.email === ADMIN_EMAIL) {
      return res.json({
        valid: true,
        user: { email: decoded.email, name: 'Admin', role: 'admin' },
      });
    }
    const users = readUsers();
    const user = users.find((u) => u.email === decoded.email);
    if (user) {
      return res.json({
        valid: true,
        user: { email: user.email, name: user.name, role: user.role, id: user.id },
      });
    }
  } catch {}
  res.status(401).json({ valid: false });
});

module.exports = router;
