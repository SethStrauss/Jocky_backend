const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');

router.get('/', authMiddleware, async (req, res) => {
  const db = require('../config/database');
  const result = await db.query('SELECT * FROM artists');
  res.json({ artists: result.rows });
});

module.exports = router;
