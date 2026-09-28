const express = require('express');
const router = express.Router();
const { db } = require('../database');

// GET /api/spaces - Browse & Filter spaces
router.get('/', (req, res) => {
  try {
    const { search, category, max_price, capacity, date, start_time, end_time } = req.query;

    let query = `
      SELECT s.*, u.name AS owner_name, u.email AS owner_email, u.phone AS owner_phone
      FROM spaces s
      JOIN users u ON s.owner_id = u.id
      WHERE 1=1
    `;
    const params = [];

    // Search by name or location
    if (search && search.trim() !== '') {
      query += ` AND (s.name LIKE ? OR s.location LIKE ? OR s.description LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    // Category filter
    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      query += ` AND LOWER(s.category) = LOWER(?)`;
      params.push(category.trim());
    }

    // Max price per hour
    if (max_price && !isNaN(Number(max_price)) && Number(max_price) > 0) {
      query += ` AND s.price_per_hour <= ?`;
      params.push(Number(max_price));
    }

    // Minimum capacity required
    if (capacity && !isNaN(Number(capacity)) && Number(capacity) > 0) {
      query += ` AND s.capacity >= ?`;
      params.push(Number(capacity));
    }

    // Filter by availability window if start_time & end_time are provided
    if (start_time && end_time) {
      query += ` AND s.available_start <= ? AND s.available_end >= ?`;
      params.push(start_time, end_time);
    }

    // Filter out spaces that have overlapping confirmed bookings on the requested date
    if (date && start_time && end_time) {
      query += `
        AND s.id NOT IN (
          SELECT space_id FROM bookings
          WHERE booking_date = ?
            AND status = 'confirmed'
            AND (start_time < ? AND end_time > ?)
        )
      `;
      params.push(date, end_time, start_time);
    }

    query += ` ORDER BY s.id DESC`;

    const spaces = db.prepare(query).all(...params);
    res.json(spaces);
  } catch (err) {
    console.error('Error fetching spaces:', err);
    res.status(500).json({ error: 'Failed to fetch spaces: ' + err.message });
  }
});

// GET /api/spaces/:id - Space details with owner & booked slots
router.get('/:id', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    if (isNaN(spaceId)) {
      return res.status(400).json({ error: 'Invalid space ID' });
    }

    const space = db.prepare(`
      SELECT s.*, u.name AS owner_name, u.email AS owner_email, u.phone AS owner_phone
      FROM spaces s
      JOIN users u ON s.owner_id = u.id
      WHERE s.id = ?
    `).get(spaceId);

    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    // Also fetch confirmed bookings for this space so the UI can display reserved intervals
    const selectedDate = req.query.date;
    let bookingsQuery = `
      SELECT id, booking_date, start_time, end_time, status
      FROM bookings
      WHERE space_id = ? AND status = 'confirmed'
    `;
    const bParams = [spaceId];

    if (selectedDate) {
      bookingsQuery += ` AND booking_date = ?`;
      bParams.push(selectedDate);
    } else {
      // By default show upcoming bookings from today onwards
      const today = new Date().toISOString().split('T')[0];
      bookingsQuery += ` AND booking_date >= ?`;
      bParams.push(today);
    }
    bookingsQuery += ` ORDER BY booking_date ASC, start_time ASC`;

    const existingBookings = db.prepare(bookingsQuery).all(...bParams);

    res.json({
      ...space,
      booked_slots: existingBookings
    });
  } catch (err) {
    console.error('Error fetching space details:', err);
    res.status(500).json({ error: 'Failed to fetch space details: ' + err.message });
  }
});

// POST /api/spaces - Add a new space (Owner flow)
router.post('/', (req, res) => {
  try {
    const ownerId = Number(req.headers['x-user-id'] || req.body.owner_id || 1);
    const {
      name,
      description,
      category,
      location,
      price_per_hour,
      capacity,
      image_url,
      available_start,
      available_end,
      amenities
    } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Space name is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Description is required' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ error: 'Category is required' });
    }
    if (!location || !location.trim()) {
      return res.status(400).json({ error: 'Location is required' });
    }
    if (price_per_hour === undefined || isNaN(Number(price_per_hour)) || Number(price_per_hour) <= 0) {
      return res.status(400).json({ error: 'Price per hour must be a valid number greater than 0' });
    }
    if (capacity === undefined || isNaN(Number(capacity)) || Number(capacity) <= 0) {
      return res.status(400).json({ error: 'Capacity must be a valid positive integer' });
    }
    if (!available_start || !available_end) {
      return res.status(400).json({ error: 'Available start and end times are required' });
    }
    if (available_start >= available_end) {
      return res.status(400).json({ error: 'Available end time must be later than start time' });
    }

    // Default image if missing or invalid
    const validImageUrl = image_url && image_url.trim().startsWith('http')
      ? image_url.trim()
      : 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80';

    const insert = db.prepare(`
      INSERT INTO spaces (
        owner_id, name, description, category, location,
        price_per_hour, capacity, image_url, available_start, available_end, amenities
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      ownerId,
      name.trim(),
      description.trim(),
      category.trim(),
      location.trim(),
      Number(price_per_hour),
      Math.floor(Number(capacity)),
      validImageUrl,
      available_start.trim(),
      available_end.trim(),
      amenities ? amenities.trim() : ''
    );

    const created = db.prepare('SELECT * FROM spaces WHERE id = ?').get(Number(result.lastInsertRowid));
    res.status(201).json({
      message: 'Space listed successfully!',
      space: created
    });
  } catch (err) {
    console.error('Error creating space:', err);
    res.status(500).json({ error: 'Failed to create space: ' + err.message });
  }
});

module.exports = router;
