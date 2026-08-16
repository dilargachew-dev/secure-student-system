const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const db = require('../config/db');

const router = express.Router();

// Submit/Update Grade (Admin & Teacher Only)
router.post('/', authenticateToken, authorizeRoles('Admin', 'Teacher'), async (req, res) => {
    const { studentId, courseId, grade } = req.body;

    try {
        const sql = 'INSERT INTO grades (student_id, course_id, grade) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE grade = ?';
        await db.execute(sql, [studentId, courseId, grade, grade]);
        res.json({ message: 'Grade submitted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update grade.' });
    }
});

module.exports = router;