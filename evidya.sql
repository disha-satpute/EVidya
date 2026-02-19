-- Database: evidya

-- DROP DATABASE IF EXISTS evidya;

CREATE DATABASE evidya
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_India.1252'
    LC_CTYPE = 'English_India.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

--Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

--Create STUDENTS Table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--Create FACULTY Table
CREATE TABLE faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    full_name VARCHAR(100) NOT NULL,

    college VARCHAR(150) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--Add Indexes (Performance Boost)

CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_faculty_email ON faculty(email);

INSERT INTO students (full_name, email, password_hash)
VALUES ('test', 'test@gmail.com', 'hashedpassword');

INSERT INTO faculty (full_name, college, email, password_hash)
VALUES ('test', 'MIT','test@gmail.com', 'hashedpassword');

