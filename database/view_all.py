import sqlite3

conn = sqlite3.connect('database/examseating.db')
cursor = conn.cursor()

cursor.execute('SELECT roll_number, name, branch, section FROM students ORDER BY branch, section, roll_number')

print("\nComplete Student Database:\n")
print(f"{'Roll Number':<15} {'Name':<30} {'Branch':<10} {'Section':<10}")
print("=" * 70)

for row in cursor.fetchall():
    print(f"{row[0]:<15} {row[1]:<30} {row[2]:<10} {row[3]:<10}")

cursor.execute('SELECT COUNT(*) FROM students')
total = cursor.fetchone()[0]
print("=" * 70)
print(f"Total Students: {total}")

conn.close()
