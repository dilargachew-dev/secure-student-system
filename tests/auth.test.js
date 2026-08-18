const request = require('supertest');
const app = require('../server');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

let refreshTokenCookie;

beforeAll(async () => {
    // DB Clean & Seed
    await db.execute('DELETE FROM users WHERE email = ?', ['testuser@example.com']);
    const hashedPassword = await bcrypt.hash('Password123!', 12);
    await db.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Test User', 'testuser@example.com', hashedPassword, 'student']
    );
});

afterAll(async () => {
    await db.execute('DELETE FROM users WHERE email = ?', ['testuser@example.com']);
    if (db.end) await db.end();
});

describe('Auth & Refresh Token Integration Tests', () => {
    it('should login successfully, return accessToken and set refreshToken cookie', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'Password123!'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
        
        // Refresh Cookie መቀበሉን ማረጋገጥ
        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
        refreshTokenCookie = cookies.find(cookie => cookie.startsWith('refreshToken='));
        expect(refreshTokenCookie).toBeDefined();
    });

    it('should issue new access token using valid refresh cookie', async () => {
        const res = await request(app)
            .post('/api/v1/auth/refresh')
            .set('Cookie', [refreshTokenCookie]);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
    });
});