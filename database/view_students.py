import sqlite3

# Connect to database
conn = sqlite3.connect('database/examseating.db')
cursor = conn.cursor()

# Query to show sample students from each section
print("Sample Roll Numbers from Database:\n")
print("=" * 60)

sections = [
    ('CSE', 'A'), ('CSE', 'B'), ('CSE', 'C'), ('CSE', 'D'), ('CSE', 'E'), ('CSE', 'F'),
    ('ECE', 'A'), ('ECE', 'B'), ('EEE', 'A')
]

for branch, section in sections:
    cursor.execute('''
        SELECT roll_number FROM students 
        WHERE branch = ? AND section = ? 
        ORDER BY roll_number 
        LIMIT 5
    ''', (branch, section))
    
    students = cursor.fetchall()
    print(f"\n{branch}-{section} (First 5 students):")
    for student in students:
        print(f"  {student[0]}")

# Show last 5 from each section
print("\n" + "=" * 60)
print("\nLast 5 Roll Numbers from Each Section:\n")

for branch, section in sections:
    cursor.execute('''
        SELECT roll_number FROM students 
        WHERE branch = ? AND section = ? 
        ORDER BY roll_number DESC
        LIMIT 5
    ''', (branch, section))
    
    students = cursor.fetchall()
    print(f"\n{branch}-{section} (Last 5 students):")
    for student in students:
        print(f"  {student[0]}")

conn.close()
