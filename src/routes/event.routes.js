const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Venue-only routes
router.post('/', requireRole('venue'), eventController.createEvent);
router.put('/:id', requireRole('venue'), eventController.updateEvent);
router.delete('/:id', requireRole('venue'), eventController.deleteEvent);

// Routes accessible by both venues and artists
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

module.exports = router;
