const db = require('../config/database');

// Send offer to artist
const createBooking = async (req, res) => {
  try {
    const { event_id, artist_id } = req.body;

    const result = await db.query(
      `INSERT INTO bookings (event_id, artist_id, status, offer_sent_at)
       VALUES ($1, $2, 'pending', CURRENT_TIMESTAMP)
       RETURNING *`,
      [event_id, artist_id]
    );

    res.status(201).json({ message: 'Offer sent', booking: result.rows[0] });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to send offer' });
  }
};

// Accept/Decline offer (artist)
const respondToBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'declined'

    const result = await db.query(
      `UPDATE bookings SET status = $1, responded_at = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING *`,
      [status, id]
    );

    res.json({ message: `Offer ${status}`, booking: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to respond' });
  }
};

module.exports = { createBooking, respondToBooking };
