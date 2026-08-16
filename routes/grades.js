const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const db = require('../config/db');

const router = express.Router();

// 1. Get All Grades (ለሁሉም የተመዘገቡ ተጠቃሚዎች)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM grades');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch grades.' });
    }
});

// 2. Submit/Update Grade (Admin & Teacher Only)
router.post('/', authenticateToken, authorizeRoles('Admin', 'Teacher'), async (req, res) => {
    const { studentId, courseId, grade } = req.body;

    if (!studentId || !courseId || grade === undefined) {
        return res.status(400).json({ error: 'Please provide studentId, courseId, and grade.' });
    }

    try {
        const sql = 'INSERT INTO grades (student_id, course_id, grade) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE grade = ?';
        await db.execute(sql, [studentId, courseId, grade, grade]);
        res.json({ message: 'Grade submitted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update grade.' });
    }
});

// 3. Update Grade by Record ID (Admin & Teacher Only)
router.put('/:id', authenticateToken, authorizeRoles('Admin', 'Teacher'), async (req, res) => {
    const { id } = req.params;
    const { grade } = req.body;

    try {
        const sql = 'UPDATE grades SET grade = ? WHERE id = ?';
        const [result] = await db.execute(sql, [grade, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Grade record not found.' });
        }

        res.json({ message: 'Grade updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update grade.' });
    }
});

// 4. Delete Grade Record (Admin Only)
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'DELETE FROM grades WHERE id = ?';
        const [result] = await db.execute(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Grade record not found.' });
        }

        res.json({ message: 'Grade deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete grade.' });
    }
});

module.exports = router;