const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

describe('Auth Routes', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_TEST_URI||'mongodb://localhost:27017/service-ms');
    });

    afterAll(async () => {
        // Clean up and disconnect
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear users before each test
        await User.deleteMany({});
    });

    describe('POST /api/auth/register', () => {
        const validUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            phone: '1234567890',
            role: 'customer',
            location: 'Test Location'
        };

        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(validUser);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', validUser.email);
        });

        it('should not register user with existing email', async () => {
            // First registration
            await request(app)
                .post('/api/auth/register')
                .send(validUser);

            // Second registration with same email
            const res = await request(app)
                .post('/api/auth/register')
                .send(validUser);

            expect(res.status).toBe(500);
            expect(res.body.message).toBe('Error registering user');
        });

        it('should validate required fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Create a test user
            await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                    phone: '1234567890',
                    role: 'customer',
                    location: 'Test Location'
                });
        });

        it('should login successfully with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
        });

        it('should not login with invalid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Invalid credentials');
        });
    });

    describe('GET /api/auth/me', () => {
        let token;

        beforeEach(async () => {
            // Register and login to get token
            const registerRes = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                    phone: '1234567890',
                    role: 'customer',
                    location: 'Test Location'
                });

            token = registerRes.body.token;
        });

        it('should get current user profile with valid token', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('email', 'test@example.com');
        });

        it('should not get profile without token', async () => {
            const res = await request(app)
                .get('/api/auth/me');

            expect(res.status).toBe(401);
        });
    });
});