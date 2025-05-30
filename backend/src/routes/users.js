const express = require('express');
const router = express.Router();
const pool = require('../config');
const bcrypt = require('bcrypt'); // Assuming you use bcrypt for hashing passwords
const jwt = require('jsonwebtoken'); // Assuming you use JWT for authentication
const authenticateToken = require('../middlewares/auth'); // Middleware to authenticate token

// Take the user token from authorization header, and give back the user object
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Users WHERE user_id = $1', [req.user.user_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new user
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert the new user into the database
        const result = await pool.query(
            `INSERT INTO Users (username, password_hash)
             VALUES ($1, $2) RETURNING user_id, username, password_hash`,
            [username, hashedPassword]
        );
        
        // Create JWT token
        const token = jwt.sign(
            { user_id: result.rows[0].user_id, username: result.rows[0].username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Return user data and token
        res.status(201).json({
            user: result.rows[0],
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// login user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Find the user by username
        const result = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        const user = result.rows[0];
        
        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { user_id: user.user_id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Return user data and token
        res.status(200).json({
            user: {
                user_id: user.user_id,
                username: user.username,
                password_hash: user.password_hash,
            },
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// delete user
router.delete('/', authenticateToken, async (req, res) => {    
    try {
        // Delete the user from the database
        const result = await pool.query('DELETE FROM Users WHERE username = $1 RETURNING *', [req.user.username]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;