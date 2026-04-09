-- =========================================
-- DATABASE: EVIDYA
-- =========================================

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
    IS_TEMPLATE = FALSE;


-- =========================================
-- EXTENSIONS
-- =========================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =========================================
-- STUDENTS TABLE
-- =========================================

CREATE TABLE students (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    prn VARCHAR(50),
    branch VARCHAR(100),
    year VARCHAR(20),
    division VARCHAR(20),

    cgpa DECIMAL(3,2),

    institute_name TEXT,
    id_card TEXT,

    github_link TEXT,
    linkedin_link TEXT,

    faculty_id UUID,

    total_points INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- FACULTY TABLE
-- =========================================

CREATE TABLE faculty (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    full_name VARCHAR(100) NOT NULL,
    college VARCHAR(150) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    branch VARCHAR(100),
    year VARCHAR(20),
    division VARCHAR(20),

    designation TEXT,
    qualification TEXT,
    expertise TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Add Foreign Key (after both tables exist)

ALTER TABLE students
ADD CONSTRAINT fk_students_faculty
FOREIGN KEY (faculty_id) REFERENCES faculty(id);


-- =========================================
-- CERTIFICATES TABLE
-- =========================================

CREATE TABLE certificates (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID REFERENCES students(id) ON DELETE CASCADE,

    certificate_name VARCHAR(200) NOT NULL,
    organization VARCHAR(200) NOT NULL,

    issue_date DATE NOT NULL,

    description TEXT,
    file_path TEXT,

    level VARCHAR(30),

    points INTEGER DEFAULT 0,

    status VARCHAR(20) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- ACTIVITIES TABLE
-- =========================================

CREATE TABLE activities (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID REFERENCES students(id) ON DELETE CASCADE,

    activity_title VARCHAR(200) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,

    organization VARCHAR(200) NOT NULL,
    activity_date DATE NOT NULL,

    description TEXT,

    proof_file TEXT,

    points INTEGER DEFAULT 0,

    status VARCHAR(20) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- PROJECTS TABLE
-- =========================================

CREATE TABLE projects (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID REFERENCES students(id) ON DELETE CASCADE,

    project_title VARCHAR(200) NOT NULL,

    description TEXT,

    technologies TEXT,
    category VARCHAR(100),
    project_level VARCHAR(100),

    start_date DATE,
    end_date DATE,

    github_link TEXT,
    demo_link TEXT,
    video_link TEXT,

    screenshot TEXT,

    status VARCHAR(20) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- PUBLICATIONS TABLE
-- =========================================

CREATE TABLE publications (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID REFERENCES students(id) ON DELETE CASCADE,

    title TEXT NOT NULL,

    publication_type TEXT,

    journal_name TEXT,
    publisher TEXT,

    publication_date DATE,

    doi_link TEXT,
    paper_link TEXT,
    certificate_link TEXT,

    status TEXT DEFAULT 'Pending',

    points INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- INDEXES (Performance Optimization)
-- =========================================

CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_faculty_email ON faculty(email);


-- =========================================
-- SAMPLE DATA
-- =========================================

INSERT INTO students (full_name, email, password_hash)
VALUES ('test', 'test@gmail.com', 'hashedpassword');


INSERT INTO faculty (full_name, college, email, password_hash)
VALUES ('test', 'MIT', 'test@gmail.com', 'hashedpassword');