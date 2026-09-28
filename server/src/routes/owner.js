const express = require('express');
const router = express.Router();
const { db } = require('../database');

// GET /api/owner/spaces - Spaces owned by the owner with metrics
router.get('/spaces', (req, res) => {
  try {
    const ownerId = Number(req.headers['x-user-id'] || req.query.owner_id || 1);

    const spaces = db.prepare(`
      SELECT 
        s.*,
        COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) AS total_bookings_count,
        COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN b.total_price ELSE 0 END), 0) AS total_earnings
      FROM spaces s
      LEFT JOIN bookings b ON s.id = b.space_id
      WHERE s.owner_id = ?
      GROUP BY s.id
      ORDER BY s.id DESC
    `).all(ownerId);

    res.json(spaces);
  } catch (err) {
    console.error('Error fetching owner spaces:', err);
    res.status(500).json({ error: 'Failed to fetch owner spaces: ' + err.message });
  }
});

// GET /api/owner/bookings - All bookings for spaces owned by this owner
router.get('/bookings', (req, res) => {
  try {
    const ownerId = Number(req.headers['x-user-id'] || req.query.owner_id || 1);

    const bookings = db.prepare(`
      SELECT 
        b.id, b.user_id, b.space_id, b.booking_date, b.start_time, b.end_time,
        b.total_price, b.status, b.created_at,
        s.name AS space_name, s.category AS space_category, s.location AS space_location,
        s.image_url, s.price_per_hour,
        u.name AS user_name, u.email AS user_email, u.phone AS user_phone
      FROM bookings b
      JOIN spaces s ON b.space_id = s.id
      JOIN users u ON b.user_id = u.id
      WHERE s.owner_id = ?
      ORDER BY b.booking_date DESC, b.start_time DESC
    `).all(ownerId);

    // Summary stats for dashboard
    const stats = db.prepare(`
      SELECT 
        COUNT(DISTINCT s.id) AS total_spaces,
        COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) AS total_confirmed_bookings,
        COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN b.total_price ELSE 0 END), 0) AS total_revenue
      FROM spaces s
      LEFT JOIN bookings b ON s.id = b.space_id
      WHERE s.owner_id = ?
    `).get(ownerId);

    res.json({
      stats: {
        total_spaces: stats?.total_spaces || 0,
        total_bookings: stats?.total_confirmed_bookings || 0,
        total_revenue: stats?.total_revenue || 0
      },
      bookings
    });
  } catch (err) {
    console.error('Error fetching owner bookings:', err);
    res.status(500).json({ error: 'Failed to fetch owner bookings: ' + err.message });
  }
});

module.exports = router;
