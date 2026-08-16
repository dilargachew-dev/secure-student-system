# 🛡️ Full-Stack Secure Student Management System

**Course / Module:** Secure Software Development  
**System Name:** Full-Stack Student Management System (Secure Edition)  
**Version:** 2.0.0 (Hardened Security Implementation)  
**Student Name:** Dilargachew Ashenafi  
**Student ID:** CTC-1287-26  

---

## 📌 Executive Summary & Project Overview
The **Full-Stack Secure Student Management System (v2.0.0)** is a production-hardened RESTful application built for educational institutions. Building upon Assignment 4, this release implements security controls aligned with the **OWASP Top 10 vulnerabilities (2021)**. The system incorporates JWT authentication, RBAC authorization, bcrypt password hashing, input sanitization, security headers via Helmet.js, rate-limiting against brute-force attacks, and comprehensive security testing.

---

## 🔐 Key Security Architecture

### 1. Authentication & Authorization
* **JWT Authentication:** Stateless token-based authentication using short-lived Access Tokens (15-minute validity) stored in `HTTP-Only`, `SameSite=Strict` cookies.
* **Role-Based Access Control (RBAC):**
  * **Admin:** Full CRUD operations across all resources (Users, Students, Courses, Grades, Audit Logs).
  * **Teacher:** View assigned student rosters, submit/edit grades, and update course materials.
  * **Student:** Read-only access to personal profile, enrolled courses, and individual grades.

### 2. Secure Data Protection
* **Password Hashing:** Passwords hashed using `bcrypt` with a salt factor of 12. Minimum 12-character complexity required.
* **Parameterized Queries:** 100% prepared SQL statements to eliminate SQL Injection (SQLi).
* **Rate Limiting:** IP-based brute-force defense (max 5 requests per 15 minutes on authentication endpoints).

### 3. Input Validation & Security Headers
* **Input Sanitization:** Requests sanitized using `express-validator` and `DOMPurify` to mitigate Stored & Reflected XSS.
* **Security Headers (Helmet.js):** Enabled `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and strict `HSTS`.

---

## 📁 Project Directory Structure

```text
secure-student-system/
├── config/
│   └── db.js                 # Parameterized MySQL Connection Pool
├── middleware/
│   └── auth.js               # JWT Verification & RBAC Middleware
├── models/
│   └── studentModel.js        # Secure Database Queries
├── routes/
│   ├── auth.js               # Login & Registration Endpoints
│   ├── students.js           # Student Profile Management
│   └── grades.js             # Grade Management
├── tests/
│   ├── security.auth.test.js # Auth & RBAC Tests
│   └── security.injection.test.js # Penetration Tests (XSS/SQLi)
├── .env.example              # Environment Configuration Template
├── server.js                 # Application Entry Point
├── package.json
└── README.md