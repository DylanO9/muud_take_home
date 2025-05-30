const { cleanupDatabase, createTestUser, testPool, createTestRequest, closeServer } = require('./setup');

describe('Contact Endpoints', () => {
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

  describe('POST /contacts/add', () => {
    it('should add a new contact', async () => {
      const res = await request
        .post('/contacts/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          contact_name: 'John Doe',
          contact_email: 'john@example.com'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.contact).toHaveProperty('contact_name', 'John Doe');
      expect(res.body.contact).toHaveProperty('contact_email', 'john@example.com');
    });

    it('should not add contact without authentication', async () => {
      const res = await request
        .post('/contacts/add')
        .send({
          contact_name: 'John Doe',
          contact_email: 'john@example.com'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /contacts/user/:id', () => {
    beforeEach(async () => {
      // Add some test contacts
      await testPool.query(
        'INSERT INTO contacts (user_id, contact_name, contact_email) VALUES ($1, $2, $3)',
        [userId, 'Contact 1', 'contact1@example.com']
      );
      await testPool.query(
        'INSERT INTO contacts (user_id, contact_name, contact_email) VALUES ($1, $2, $3)',
        [userId, 'Contact 2', 'contact2@example.com']
      );
    });

    it('should get all contacts for authenticated user', async () => {
      const res = await request
        .get(`/contacts/user/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('contact_name');
      expect(res.body[0]).toHaveProperty('contact_email');
    });

    it('should not get contacts without authentication', async () => {
      const res = await request
        .get(`/contacts/user/${userId}`);

      expect(res.statusCode).toBe(401);
    });

    it('should not get contacts for different user', async () => {
      // Create another user
      const { token: otherToken, user: otherUser } = await createTestUser('otheruser', 'password123');

      const res = await request
        .get(`/contacts/user/${userId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
}); 