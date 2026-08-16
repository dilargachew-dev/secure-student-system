const db = require('../config/db');

// Secure parameterized query prevents SQL Injection
const getStudentById = async (studentId) => {
    const sql = `
        SELECT s.id, u.name, u.email, s.student_code, s.department, s.gpa 
        FROM students s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.id = ?
    `;
    const [rows] = await db.execute(sql, [studentId]);
    return rows[0];
};

const getAllStudents = async () => {
    const sql = `
        SELECT s.id, u.name, u.email, s.student_code, s.department, s.gpa 
        FROM students s 
        JOIN users u ON s.user_id = u.id
    `;
    const [rows] = await db.execute(sql);
    return rows;
};

const createStudent = async (userId, studentCode, department, gpa) => {
    const sql = 'INSERT INTO students (user_id, student_code, department, gpa) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(sql, [userId, studentCode, department, gpa]);
    return result.insertId;
};

module.exports = { getStudentById, getAllStudents, createStudent };