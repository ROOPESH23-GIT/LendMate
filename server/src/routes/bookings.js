const express = require('express');
const router = express.Router();
const { db } = require('../database');

// Helper: convert HH:MM to decimal hours for duration calculation
function timeToHours(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h + m / 60;
}

// GET /api/bookings - Get all bookings for the logged-in user
router.get('/', (req, res) => {
  try {
    const userId = Number(req.headers['x-user-id'] || req.query.user_id || 3);

    const bookings = db.prepare(`
      SELECT 
        b.id, b.user_id, b.space_id, b.booking_date, b.start_time, b.end_time,
        b.total_price, b.status, b.created_at,
        s.name AS space_name, s.category AS space_category, s.location AS space_location,
        s.image_url, s.price_per_hour,
        u.name AS user_name, u.email AS user_email
      FROM bookings b
      JOIN spaces s ON b.space_id = s.id
      JOIN users u ON b.user_id = u.id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC, b.start_time DESC
    `).all(userId);

    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to retrieve bookings: ' + err.message });
  }
});

// POST /api/bookings - Create a booking with strict DOUBLE-BOOKING PREVENTION
router.post('/', (req, res) => {
  try {
    const userId = Number(req.headers['x-user-id'] || req.body.user_id || 3);
    const { space_id, booking_date, start_time, end_time } = req.body;

    // 1. Validate required fields
    if (!space_id) {
      return res.status(400).json({ error: 'Space ID is required' });
    }
    if (!booking_date || !/^\d{4}-\d{2}-\d{2}$/.test(booking_date)) {
      return res.status(400).json({ error: 'A valid booking date in YYYY-MM-DD format is required' });
    }
    if (!start_time || !end_time) {
      return res.status(400).json({ error: 'Both start time and end time are required' });
    }

    // 2. Validate time logical order
    if (start_time >= end_time) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    // 3. Verify space exists
    const space = db.prepare('SELECT * FROM spaces WHERE id = ?').get(Number(space_id));
    if (!space) {
      return res.status(404).json({ error: 'Selected space does not exist' });
    }

    // 4. Verify within space operating hours
    if (start_time < space.available_start || end_time > space.available_end) {
      return res.status(400).json({
        error: `Selected hours are outside operating hours for this space (${space.available_start} - ${space.available_end})`
      });
    }

    // 5. CRITICAL REQUIREMENT: PREVENT DOUBLE BOOKING
    // Overlap logic: existing.start < requested.end AND existing.end > requested.start
    const overlapping = db.prepare(`
      SELECT id, start_time, end_time, status
      FROM bookings
      WHERE space_id = ?
        AND booking_date = ?
        AND status = 'confirmed'
        AND (start_time < ? AND end_time > ?)
    `).all(Number(space_id), booking_date, end_time, start_time);

    if (overlapping.length > 0) {
      return res.status(409).json({
        error: 'This space is already booked for the selected time.',
        conflict: overlapping[0]
      });
    }

    // 6. Automatic price calculation based on hours
    const durationHours = timeToHours(end_time) - timeToHours(start_time);
    if (durationHours <= 0) {
      return res.status(400).json({ error: 'Booking duration must be greater than zero' });
    }
    const totalPrice = Math.round(durationHours * space.price_per_hour * 100) / 100;

    // 7. Insert the confirmed booking
    const insertBooking = db.prepare(`
      INSERT INTO bookings (
        user_id, space_id, booking_date, start_time, end_time, total_price, status
      ) VALUES (?, ?, ?, ?, ?, ?, 'confirmed')
    `);

    const result = insertBooking.run(
      userId,
      Number(space_id),
      booking_date,
      start_time,
      end_time,
      totalPrice
    );

    const newBooking = db.prepare(`
      SELECT 
        b.id, b.user_id, b.space_id, b.booking_date, b.start_time, b.end_time,
        b.total_price, b.status, b.created_at,
        s.name AS space_name, s.category AS space_category, s.location AS space_location,
        s.image_url, s.price_per_hour
      FROM bookings b
      JOIN spaces s ON b.space_id = s.id
      WHERE b.id = ?
    `).get(Number(result.lastInsertRowid));

    res.status(201).json({
      message: 'Booking confirmed successfully!',
      booking: newBooking
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Failed to create booking: ' + err.message });
  }
});

// DELETE /api/bookings/:id - Cancel a booking
router.delete('/:id', (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    if (isNaN(bookingId)) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update status to cancelled so time slot becomes immediately free
    db.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").run(bookingId);

    res.json({
      message: 'Booking cancelled successfully. The slot is now available.',
      id: bookingId
    });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ error: 'Failed to cancel booking: ' + err.message });
  }
});

module.exports = router;
