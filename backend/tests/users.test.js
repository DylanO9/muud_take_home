const { cleanupDatabase, createTestUser, testPool, createTestRequest, closeServer } = require('./setup');

describe('User Endpoints', () => {
  let request;

  beforeEach(async () => {
    await cleanupDatabase();
    request = await createTestRequest();
  });

  afterEach(async () => {
    await closeServer(request);
  });

  afterAll(async () => {
    await testPool.end();
  });

  describe('POST /users/signup', () => {
    it('should create a new user and return token', async () => {
      const res = await request
        .post('/users/signup')
        .send({
          username: 'newuser',
          password: 'password123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', 'newuser');
      expect(res.body.user).toHaveProperty('user_id');
    });

    it('should not create user with existing username', async () => {
      // First create a user
      await createTestUser('existinguser', 'password123');

      // Try to create another user with same username
      const res = await request
        .post('/users/signup')
        .send({
          username: 'existinguser',
          password: 'password123'
        });

      expect(res.statusCode).toBe(500);
    });
  });

  describe('POST /users/login', () => {
    beforeEach(async () => {
      await createTestUser('testuser', 'password123');
    });

    it('should login with correct credentials', async () => {
      const res = await request
        .post('/users/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', 'testuser');
    });

    it('should not login with incorrect password', async () => {
      const res = await request
        .post('/users/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /users/me', () => {
    it('should get user profile with valid token', async () => {
      const { token } = await createTestUser('testuser', 'password123');

      const res = await request
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('username', 'testuser');
    });

    it('should not get profile without token', async () => {
      const res = await request
        .get('/users/me');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /users', () => {
    it('should delete user with valid token', async () => {
      const { token } = await createTestUser('testuser', 'password123');

      const res = await request
        .delete('/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'User deleted successfully');
    });

    it('should not delete user without token', async () => {
      const res = await request
        .delete('/users');

      expect(res.statusCode).toBe(401);
    });
  });
}); 