const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { getStudentById, getAllStudents, createStudent } = require('../models/studentModel');

const router = express.Router();

// Get All Students (Admin & Teacher Only)
router.get('/', authenticateToken, authorizeRoles('Admin', 'Teacher'), async (req, res) => {
    try {
        const students = await getAllStudents();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch students.' });
    }
});

// Create Student (Admin Only)
router.post('/', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
    const { userId, studentCode, department, gpa } = req.body;
    try {
        const id = await createStudent(userId, studentCode, department, gpa);
        res.status(201).json({ message: 'Student created successfully', id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create student.' });
    }
});

// Get Student Profile by ID (Admin, Teacher, or Self)
router.get('/:id', authenticateToken, async (req, res) => {
    const studentId = parseInt(req.params.id, 10);

    try {
        const student = await getStudentById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        // Broken Access Control Prevention (Object Level Access Control)
        if (req.user.role === 'Student' && req.user.id !== student.user_id) {
            return res.status(403).json({ error: 'Unauthorized: You can only view your own profile.' });
        }

        res.json(student);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

module.exports = router;