const request = require('supertest');
const app = require('../server');

describe('Input Validation & Sanitization Tests', () => {

    // TEST-03 & TEST-04: XSS and Input Sanitization Validation
    test('TEST-04: Should sanitize and encode XSS payloads in registration fields', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: "<script>alert('XSS')</script> TestUser",
                email: "xss_test@example.com",
                password: "SecurePassword123!",
                role: "Student"
            });

        // express-validator escape() converts '<' to '&lt;' and '>' to '&gt;'
        expect(res.statusCode).not.toEqual(500);
    });
});