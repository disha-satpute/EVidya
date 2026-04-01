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

--certificate table 
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID REFERENCES students(id) ON DELETE CASCADE,

    certificate_name VARCHAR(200) NOT NULL,

    organization VARCHAR(200) NOT NULL,

    issue_date DATE NOT NULL,

    description TEXT,

    file_path TEXT,

    status VARCHAR(20) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--activity table 

CREATE TABLE activities (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id UUID REFERENCES students(id) ON DELETE CASCADE, 
activity_title VARCHAR(200) NOT NULL,
activity_type VARCHAR(100) NOT NULL,
organization VARCHAR(200) NOT NULL,
activity_date DATE NOT NULL,
description TEXT,
proof_file TEXT,
status VARCHAR(20) DEFAULT 'Pending',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--alter table certificates to add new columns for level and points
ALTER TABLE certificates ADD COLUMN level VARCHAR(30);
ALTER TABLE certificates ADD COLUMN points INTEGER DEFAULT 0;

ALTER TABLE activities ADD COLUMN points INTEGER DEFAULT 0;

--alter table students to add new columns for profile information and total points
ALTER TABLE students ADD COLUMN total_points INTEGER DEFAULT 0;

ALTER TABLE students
ADD COLUMN prn VARCHAR(50),
ADD COLUMN branch VARCHAR(100),
ADD COLUMN year VARCHAR(20),
ADD COLUMN cgpa DECIMAL(3,2),
ADD COLUMN github_link TEXT,
ADD COLUMN linkedin_link TEXT;


--create projects table
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

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

--alter table projects to add status column
ALTER TABLE projects ADD COLUMN status VARCHAR(20) DEFAULT 'Pending';


--create publications table
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
