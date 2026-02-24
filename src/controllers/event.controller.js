const db = require('../config/database');

// Create event
const createEvent = async (req, res) => {
  try {
    const {
      event_name,
      event_date,
      start_time,
      end_time,
      dance_floor_id,
      amount_sek,
      notes,
      frequency
    } = req.body;

    // Get user's venue
    const venueResult = await db.query(
      'SELECT id FROM venues WHERE user_id = $1',
      [req.user.id]
    );

    if (venueResult.rows.length === 0) {
      return res.status(404).json({ error: 'Venue not found for user' });
    }

    const venueId = venueResult.rows[0].id;

    // Create event
    const result = await db.query(
      `INSERT INTO events 
       (venue_id, dance_floor_id, event_name, event_date, start_time, end_time, amount_sek, notes, frequency, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [venueId, dance_floor_id, event_name, event_date, start_time, end_time, amount_sek, notes, frequency, req.user.id]
    );

    res.status(201).json({
      message: 'Event created successfully',
      event: result.rows[0]
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Get all events for a venue
const getEvents = async (req, res) => {
  try {
    const { start_date, end_date, status } = req.query;

    // Get user's venue
    const venueResult = await db.query(
      'SELECT id FROM venues WHERE user_id = $1',
      [req.user.id]
    );

    if (venueResult.rows.length === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    const venueId = venueResult.rows[0].id;

    let query = `
      SELECT e.*, 
             v.name as venue_name,
             df.name as dance_floor_name,
             a.stage_name as artist_name,
             b.status as booking_status
      FROM events e
      LEFT JOIN venues v ON e.venue_id = v.id
      LEFT JOIN dance_floors df ON e.dance_floor_id = df.id
      LEFT JOIN bookings b ON e.id = b.event_id
      LEFT JOIN artists a ON b.artist_id = a.id
      WHERE e.venue_id = $1
    `;

    const params = [venueId];
    let paramCount = 1;

    if (start_date && end_date) {
      paramCount++;
      query += ` AND e.event_date BETWEEN $${paramCount} AND $${paramCount + 1}`;
      params.push(start_date, end_date);
      paramCount++;
    }

    if (status) {
      paramCount++;
      query += ` AND e.status = $${paramCount}`;
      params.push(status);
    }

    query += ' ORDER BY e.event_date ASC, e.start_time ASC';

    const result = await db.query(query, params);

    res.json({ events: result.rows });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to get events' });
  }
};

// Get single event
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT e.*, 
              v.name as venue_name,
              df.name as dance_floor_name
       FROM events e
       LEFT JOIN venues v ON e.venue_id = v.id
       LEFT JOIN dance_floors df ON e.dance_floor_id = df.id
       WHERE e.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ event: result.rows[0] });

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Failed to get event' });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if event belongs to user's venue
    const checkResult = await db.query(
      `SELECT e.id FROM events e
       JOIN venues v ON e.venue_id = v.id
       WHERE e.id = $1 AND v.user_id = $2`,
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found or unauthorized' });
    }

    // Build dynamic UPDATE query
    const allowedFields = ['event_name', 'event_date', 'start_time', 'end_time', 'amount_sek', 'notes', 'status'];
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE events 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);

    res.json({
      message: 'Event updated successfully',
      event: result.rows[0]
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if event belongs to user's venue
    const checkResult = await db.query(
      `SELECT e.id FROM events e
       JOIN venues v ON e.venue_id = v.id
       WHERE e.id = $1 AND v.user_id = $2`,
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found or unauthorized' });
    }

    await db.query('DELETE FROM events WHERE id = $1', [id]);

    res.json({ message: 'Event deleted successfully' });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
};
