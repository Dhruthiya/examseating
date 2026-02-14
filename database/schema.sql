-- Database Schema for Exam Seating Arrangement System

-- Students Table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    branch VARCHAR(10) NOT NULL,
    section VARCHAR(5) NOT NULL,
    year INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exams Table
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    exam_name VARCHAR(100) NOT NULL,
    exam_date DATE NOT NULL,
    exam_time TIME NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ExamSchedule Table (Junction)
CREATE TABLE exam_schedule (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    branch VARCHAR(10) NOT NULL,
    section VARCHAR(5) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms Table
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    room_name VARCHAR(100) NOT NULL,
    capacity INTEGER DEFAULT 28,
    branches_allocated TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SeatAllocations Table
CREATE TABLE seat_allocations (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    bench_number INTEGER NOT NULL,
    position VARCHAR(10) NOT NULL,
    column_number INTEGER,
    row_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_students_branch_section ON students(branch, section);
CREATE INDEX idx_exam_schedule_branch_section ON exam_schedule(branch, section);
CREATE INDEX idx_seat_allocations_room ON seat_allocations(room_id);
