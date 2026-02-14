import sqlite3
import os

# Create database directory if it doesn't exist
os.makedirs('database', exist_ok=True)

# Connect to SQLite database
conn = sqlite3.connect('database/examseating.db')
cursor = conn.cursor()

# Create tables
cursor.execute('''
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roll_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    branch TEXT NOT NULL,
    section TEXT NOT NULL,
    year INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_name TEXT NOT NULL,
    exam_date DATE NOT NULL,
    exam_time TIME NOT NULL,
    subject_code TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS exam_schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER,
    branch TEXT NOT NULL,
    section TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_name TEXT NOT NULL,
    capacity INTEGER DEFAULT 28,
    branches_allocated TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS seat_allocations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER,
    student_id INTEGER,
    bench_number INTEGER NOT NULL,
    position TEXT NOT NULL,
    column_number INTEGER,
    row_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
)
''')

print("Creating dummy student data...")

# Student data configuration
sections_config = [
    ('CSE', 'A', 60),
    ('CSE', 'B', 60),
    ('CSE', 'C', 60),
    ('CSE', 'D', 60),
    ('CSE', 'E', 60),
    ('CSE', 'F', 60),
    ('ECE', 'A', 60),
    ('ECE', 'B', 60),
    ('EEE', 'A', 60),
]

# Generate and insert student data
students_data = []
for branch, section, count in sections_config:
    for i in range(1, count + 1):
        roll_number = f"{branch}{section}{i:03d}"
        name = f"{branch} {section} Student {i}"
        students_data.append((roll_number, name, branch, section, 1))
        
cursor.executemany('''
    INSERT INTO students (roll_number, name, branch, section, year)
    VALUES (?, ?, ?, ?, ?)
''', students_data)

conn.commit()

# Verify data
cursor.execute('SELECT branch, section, COUNT(*) FROM students GROUP BY branch, section ORDER BY branch, section')
results = cursor.fetchall()

print("\nStudent data inserted successfully!")
print("\nSummary:")
print("-" * 40)
for branch, section, count in results:
    print(f"{branch}-{section}: {count} students")

cursor.execute('SELECT COUNT(*) FROM students')
total = cursor.fetchone()[0]
print("-" * 40)
print(f"Total Students: {total}")

conn.close()
print("\nDatabase created successfully at: database/examseating.db")
