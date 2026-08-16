const request = require('supertest');
const app = require('../server'); // ወይም ሰርቨርህ የሚገኝበት ዋና ፋይል

describe('Auth & Refresh Token Integration Tests', () => {
    let accessToken;
    let refreshTokenCookie;

    it('should login successfully, return accessToken and set refreshToken cookie', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'dil@example.com',
                password: 'SecurePassword123!'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
        
        // HTTP-Only Cookie መላኩን ማረጋገጥ
        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(cookies[0]).toContain('refreshToken');

        accessToken = res.body.accessToken;
        refreshTokenCookie = cookies[0];
    });

    it('should issue new access token using valid refresh cookie', async () => {
        const res = await request(app)
            .post('/api/v1/auth/refresh-token')
            .set('Cookie', [refreshTokenCookie]);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
    });

    it('should clear refresh cookie on logout', async () => {
        const res = await request(app)
            .post('/api/v1/auth/logout');

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toMatch(/logged out/i);
    });
});