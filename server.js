const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

// 1. Import Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const gradeRoutes = require('./routes/grades');

const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// 2. HTTP Security Headers (Helmet.js)
app.use(helmet());

// 3. Cross-Origin Resource Sharing (CORS) Lock
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// 4. Rate Limiting Against Brute-Force Attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// 5. Request Body Size Limit (Mitigates Denial of Service / DoS)
app.use(express.json({ limit: '10kb' }));

// 6. Mount API Routes under /api/v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/grades', gradeRoutes);

// Base Health Check Route
app.get('/', (req, res) => {
    res.json({ message: 'Secure Student Management System API v2.0.0 Online' });
});

// Start Server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🔒 Server running securely on port ${PORT}`);
    });
}

// Export for Automated Testing (Supertest)
module.exports = app;