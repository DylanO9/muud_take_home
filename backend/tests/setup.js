const { Pool } = require('pg');
const createApp = require('../src/app');
const request = require('supertest');
require('dotenv').config();

// Create a test database pool
const testPool = new Pool({
  connectionString: process.env.DB_DATABASE_URL
});

// Helper function to clean up the database between tests
async function cleanupDatabase() {
  try {
    await testPool.query('DELETE FROM journal_entries');
    await testPool.query('DELETE FROM contacts');
    await testPool.query('DELETE FROM users');
  } catch (error) {
    console.error('Error cleaning up database:', error);
  }
}

// Helper function to create a test user and return their token
async function createTestUser(username = 'testuser', password = 'testpass') {
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await testPool.query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING user_id, username',
    [username, hashedPassword]
  );
  
  const token = jwt.sign(
    { user_id: result.rows[0].user_id, username: result.rows[0].username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  return {
    user: result.rows[0],
    token
  };
}

// Helper function to create a test request object with server
async function createTestRequest() {
  const app = createApp();
  const server = app.listen(0); // Use port 0 to get a random available port
  const testRequest = request(server);
  
  // Add server to the request object so we can close it later
  testRequest.server = server;
  
  return testRequest;
}

// Helper function to close the server
async function closeServer(request) {
  if (request && request.server) {
    await new Promise((resolve) => request.server.close(resolve));
  }
}

module.exports = {
  testPool,
  cleanupDatabase,
  createTestUser,
  createTestRequest,
  closeServer
}; 