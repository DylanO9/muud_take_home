const { cleanupDatabase, createTestUser, testPool, createTestRequest, closeServer } = require('./setup');

describe('Journal Endpoints', () => {
  let authToken;
  let userId;
  let request;

  beforeEach(async () => {
    await cleanupDatabase();
    const { token, user } = await createTestUser('testuser', 'password123');
    authToken = token;
    userId = user.user_id;
    request = await createTestRequest();
  });

  afterEach(async () => {
    await closeServer(request);
  });

  afterAll(async () => {
    await testPool.end();
  });

  describe('POST /journal/entry', () => {
    it('should create a new journal entry', async () => {
      const res = await request
        .post('/journal/entry')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          entry_text: 'Today was a great day!',
          mood_rating: 4
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('journal_entry_id');
    });

    it('should not create entry without authentication', async () => {
      const res = await request
        .post('/journal/entry')
        .send({
          entry_text: 'Today was a great day!',
          mood_rating: 4
        });

      expect(res.statusCode).toBe(401);
    });

    it('should not create entry with invalid mood rating', async () => {
      const res = await request
        .post('/journal/entry')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          entry_text: 'Today was a great day!',
          mood_rating: 6 // Invalid rating
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /journal/user/:id', () => {
    beforeEach(async () => {
      // Add some test journal entries
      await testPool.query(
        'INSERT INTO journal_entries (user_id, entry_text, mood_rating) VALUES ($1, $2, $3)',
        [userId, 'Entry 1', 3]
      );
      await testPool.query(
        'INSERT INTO journal_entries (user_id, entry_text, mood_rating) VALUES ($1, $2, $3)',
        [userId, 'Entry 2', 4]
      );
    });

    it('should get all journal entries for authenticated user', async () => {
      const res = await request
        .get(`/journal/user/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('entry_text');
      expect(res.body[0]).toHaveProperty('mood_rating');
      expect(res.body[0]).toHaveProperty('timestamp');
    });

    it('should not get entries without authentication', async () => {
      const res = await request
        .get(`/journal/user/${userId}`);

      expect(res.statusCode).toBe(401);
    });

    it('should not get entries for different user', async () => {
      // Create another user
      const { token: otherToken, user: otherUser } = await createTestUser('otheruser', 'password123');

      const res = await request
        .get(`/journal/user/${userId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
}); 