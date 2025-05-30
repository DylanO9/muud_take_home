const express = require('express');
const router = express.Router();
const pool = require('../config');
const authenticateToken = require('../middlewares/auth');

// POST /contacts/add
router.post('/add', authenticateToken, async (req, res) => {
    const { contact_name, contact_email } = req.body;
    const user_id = req.user.user_id; // Get user_id from authenticated token

    try {
        const result = await pool.query(
            `INSERT INTO contacts (user_id, contact_name, contact_email)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [user_id, contact_name, contact_email]
        );

        res.status(201).json({
            success: true,
            contact: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
});

// GET /contacts/user/:id
router.get('/user/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;

    try {
        // Verify the requesting user has permission to view these contacts
        if (req.user.user_id !== parseInt(userId)) {
            return res.status(403).json({ error: 'Unauthorized to view these contacts' });
        }

        const result = await pool.query(
            `SELECT * FROM contacts 
             WHERE user_id = $1`,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
