const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);
router.post('/', bookingController.createBooking);
router.put('/:id', bookingController.respondToBooking);

module.exports = router;
