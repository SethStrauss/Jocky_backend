const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const artistRoutes = require('./routes/artist.routes');
const bookingRoutes = require('./routes/booking.routes');
const messageRoutes = require('./routes/message.routes');
const venueRoutes = require('./routes/venue.routes');

app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Jocky API is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/venues', venueRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎵 JOCKY API running on port ${PORT}`);
});

module.exports = app;
