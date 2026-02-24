const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);
router.get('/', async (req, res) => {
  const db = require('../config/database');
  const result = await db.query('SELECT * FROM venues');
  res.json({ venues: result.rows });
});

module.exports = router;
