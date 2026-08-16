const request = require('supertest');
const app = require('../server');

describe('Authentication & Authorization Security Tests', () => {

    // TEST-01: Unauthenticated request should be blocked (HTTP 401)
    test('TEST-01: Should block unauthenticated requests to protected routes', async () => {
        const res = await request(app)
            .get('/api/v1/students');

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error', 'Access token required.');
    });

    // TEST-02: RBAC Restriction Check (HTTP 403)
    test('TEST-02: Should enforce Admin-only route restrictions against Student role', async () => {
        // Mock Student JWT payload
        const jwt = require('jsonwebtoken');
        const studentToken = jwt.sign(
            { id: 99, email: 'student@example.com', role: 'Student' },
            process.env.JWT_SECRET || 'super_secret_jwt_key_32_chars_long_min',
            { expiresIn: '15m' }
        );

        const res = await request(app)
            .post('/api/v1/students')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
                userId: 2,
                studentCode: 'STU-001',
                department: 'CS',
                gpa: 3.8
            });

        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('error', 'Unauthorized: Insufficient privileges.');
    });
});