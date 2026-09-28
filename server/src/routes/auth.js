const express = require('express');
const router = express.Router();
const { db } = require('../database');

// GET all users (convenient for hackathon demo switching)
router.get('/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, email, role, phone, created_at FROM users ORDER BY id ASC').all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET current user
router.get('/me', (req, res) => {
  const userId = req.headers['x-user-id'] || req.query.user_id;
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated. Please pass x-user-id header.' });
  }

  try {
    const user = db.prepare('SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Login
router.post('/login', (req, res) => {
  const { email, role } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    let user = db.prepare('SELECT id, name, email, role, phone, created_at FROM users WHERE email = ?').get(email.trim().toLowerCase());
    
    // For demo convenience, if user doesn't exist, create automatically
    if (!user) {
      const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const userRole = role === 'owner' ? 'owner' : 'user';
      const insert = db.prepare('INSERT INTO users (name, email, role, phone) VALUES (?, ?, ?, ?)');
      const result = insert.run(name, email.trim().toLowerCase(), userRole, '+91 98000 00000');
      user = db.prepare('SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?').get(Number(result.lastInsertRowid));
    }

    res.json({
      message: 'Login successful',
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Register
router.post('/register', (req, res) => {
  const { name, email, role, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const userRole = role === 'owner' ? 'owner' : 'user';

  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim().toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
    }

    const insert = db.prepare('INSERT INTO users (name, email, role, phone) VALUES (?, ?, ?, ?)');
    const result = insert.run(name.trim(), email.trim().toLowerCase(), userRole, phone ? phone.trim() : '');
    const user = db.prepare('SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?').get(Number(result.lastInsertRowid));

    res.status(201).json({
      message: 'Registration successful',
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
