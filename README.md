<div align="center">

# Full-Stack Express + MySQL + Docker

### A Production-Hardened Multi-Tier Student Management & Security System

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-v4.18-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-v8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-v24.0-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Dual--Token-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-Security--Tests-C21325?style=for-the-badge&logo=jest&logoColor=white)

</div>

---

# 🛡️ Full-Stack Secure Student Management System

**Course / Module:** Secure Software Development  
**System Name:** Full-Stack Student Management System (Secure Edition)  
**Version:** 2.0.0 (Hardened Security Implementation)  
**Student Name:** Dilargachew Ashenafi  
**Student ID:** CTC-1287-26  

---

## 📌 Executive Summary & Project Overview

The **Full-Stack Secure Student Management System (v2.0.0)** is a production-hardened RESTful application built for educational institutions. This release implements security controls aligned with the **OWASP Top 10 (2021)** framework. The system incorporates JWT-based dual-token authentication, Role-Based Access Control (RBAC), bcrypt password hashing, prepared SQL statements, security headers via Helmet.js, IP rate-limiting, and containerized deployment with Docker.

---

## 🔐 Key Security Architecture

### 1. Authentication & Authorization
* **JWT Dual-Token Strategy:** Stateless authentication using short-lived Access Tokens (15-min validity) stored in `HTTP-Only`, `SameSite=Strict` cookies, paired with secure Refresh Tokens.
* **Role-Based Access Control (RBAC):**
  * **Admin:** Full CRUD operations across all resources (Users, Students, Courses, Grades, System Logs).
  * **Teacher:** View student rosters, submit/edit grades, and update course materials.
  * **Student:** Read-only access to personal profile, enrolled courses, and individual grades.

### 2. Secure Data Protection
* **Password Hashing:** Passwords hashed using `bcryptjs` with a salt factor of 12. Minimum 12-character complexity required.
* **SQL Injection (SQLi) Mitigation:** 100% prepared SQL statements (`db.execute()`) using parameterized placeholders (`?`).
* **Rate Limiting:** IP-based brute-force defense via `express-rate-limit` (max 5 requests per 15 minutes on authentication routes).

### 3. Input Validation & Security Headers
* **Input Sanitization:** Incoming payloads sanitized using `express-validator` to mitigate XSS attacks.
* **Security Headers (Helmet.js):** Configured `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`, and strict `HSTS`.

---

## 🏗️ System Architecture & Data Flow

Below is the dynamic execution path of an incoming HTTP request encountering the security middleware engine:

```mermaid
sequenceDiagram
    autonumber
    actor Attacker as 🚨 Scanner / Attacker
    actor User as 👤 Legitimate User
    participant App as 🌐 Web Application
    participant Auth as 🛡️ Security Middleware
    participant DB as 🗄️ Database
    participant Audit as 📊 Central SOC / Audit Log

    %% Normal Traffic Flow
    rect rgb(30, 40, 30)
        Note over User, DB: Normal Traffic Flow
        User->>App: GET /api/v1/students (Bearer Token)
        App->>Auth: Evaluate Route & Validate JWT
        Auth-->>App: Pass (next())
        App->>DB: Parameterized Query (SELECT * FROM students)
        DB-->>App: Return SQL Results
        App-->>User: 200 OK (Render Student Data)
    end

    %% Attack Detection Flow
    rect rgb(50, 30, 30)
        Note over Attacker, Audit: Attack Detection Flow
        Attacker->>App: POST /api/v1/auth/login (SQLi Payload / Brute Force)
        App->>Auth: Intercept Request
        Auth->>Auth: Match Attack Pattern / Rate Limit Triggered!
        
        par [Asynchronous Security Alert]
            Auth->>Audit: Push Event via Logs (IP, Headers, Payload)
            Audit->>Audit: Flash Red SOC Alert (< 100ms)
        and [Security Response]
            Auth-->>Attacker: 403 Forbidden / 429 Too Many Requests
        end
    end



--

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
├── .dockerignore              # Docker Build Exclusions
├── .env.example              # Environment Configuration Template
├── Dockerfile                # Containerization Blueprint
├── docker-compose.yml        # Multi-Container Orchestration
├── server.js                 # Application Entry Point
├── package.json
└── README.md