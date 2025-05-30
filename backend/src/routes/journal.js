const express = require('express');
const router = express.Router();
const pool = require('../config');
const jwt = require('jsonwebtoken'); // Assuming you use JWT for authentication
const authenticateToken = require('../middlewares/auth'); // Middleware to authenticate token
// POST /journal/entry
router.post('/entry', authenticateToken, async (req, res) => {
    const { entry_text, mood_rating } = req.body;
    const user_id = req.user.user_id; // Get user_id from authenticated token

    try {
        // Validate mood rating
        if (mood_rating < 1 || mood_rating > 5) {
            return res.status(400).json({ error: 'Mood rating must be between 1 and 5' });
        }

        // Insert the journal entry
        const result = await pool.query(
            `INSERT INTO journal_entries (user_id, entry_text, mood_rating)
             VALUES ($1, $2, $3)
             RETURNING journal_entry_id`,
            [user_id, entry_text, mood_rating]
        );

        res.status(201).json({
            success: true,
            journal_entry_id: result.rows[0].journal_entry_id
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
});

// GET /journal/user/:id
router.get('/user/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;

    try {
        // Verify the requesting user has permission to view these entries
        if (req.user.user_id !== parseInt(userId)) {
            return res.status(403).json({ error: 'Unauthorized to view these entries' });
        }

        const result = await pool.query(
            `SELECT * FROM journal_entries 
             WHERE user_id = $1 
             ORDER BY timestamp DESC`,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;