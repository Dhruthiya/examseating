import sqlite3

conn = sqlite3.connect('../database/examseating.db')
cursor = conn.cursor()

# Create subjects table
cursor.execute('''
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_code TEXT UNIQUE NOT NULL,
    subject_name TEXT NOT NULL,
    branches TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

# Insert dummy subjects
subjects = [
    # Common subjects (multiple branches)
    ('MATH101', 'Mathematics-I', 'CSE,ECE,EEE'),
    ('PHY101', 'Engineering Physics', 'CSE,ECE,EEE'),
    ('ENG101', 'English Communication', 'CSE,ECE,EEE'),
    ('CHEM101', 'Engineering Chemistry', 'CSE,ECE,EEE'),
    
    # CSE specific
    ('CS101', 'Data Structures', 'CSE'),
    ('CS102', 'Operating Systems', 'CSE'),
    ('CS103', 'Database Management', 'CSE'),
    ('CS104', 'Machine Learning', 'CSE'),
    ('CS105', 'Computer Networks', 'CSE'),
    
    # ECE specific
    ('EC101', 'Digital Electronics', 'ECE'),
    ('EC102', 'Signal Processing', 'ECE'),
    ('EC103', 'Communication Systems', 'ECE'),
    ('EC104', 'Microprocessors', 'ECE'),
    ('EC105', 'VLSI Design', 'ECE'),
    
    # EEE specific
    ('EE101', 'Circuit Theory', 'EEE'),
    ('EE102', 'Power Systems', 'EEE'),
    ('EE103', 'Electrical Machines', 'EEE'),
    ('EE104', 'Control Systems', 'EEE'),
    ('EE105', 'Power Electronics', 'EEE'),
]

cursor.executemany('''
    INSERT OR IGNORE INTO subjects (subject_code, subject_name, branches)
    VALUES (?, ?, ?)
''', subjects)

conn.commit()

# Display subjects
cursor.execute('SELECT * FROM subjects ORDER BY subject_code')
print("\nSubjects added to database:\n")
print(f"{'Code':<12} {'Name':<30} {'Branches':<15}")
print("=" * 60)
for row in cursor.fetchall():
    print(f"{row[1]:<12} {row[2]:<30} {row[3]:<15}")

cursor.execute('SELECT COUNT(*) FROM subjects')
total = cursor.fetchone()[0]
print("=" * 60)
print(f"Total Subjects: {total}")

conn.close()
print("\nSubjects table created successfully!")
