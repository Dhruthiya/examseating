let seatingData = [];
let sections = [];
let examDate = '';
let examTime = '';

window.addEventListener('DOMContentLoaded', function() {
    seatingData = JSON.parse(sessionStorage.getItem('seatingData') || '[]');
    sections = JSON.parse(sessionStorage.getItem('sections') || '[]');
    examDate = sessionStorage.getItem('examDate') || '';
    examTime = sessionStorage.getItem('examTime') || '';
    
    displayResults();
});

function displayResults() {
    let html = '<h2>🏫 Seating Arrangement by Classroom</h2>';
    
    sections.forEach(classroom => {
        const classroomSeats = seatingData.filter(row => row.classroom === classroom.name);
        if (classroomSeats.length === 0) return;
        
        html += `
            <div class="classroom-table">
                <h3>🚪 ${classroom.name}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>🪑 Bench</th>
                            <th>👤 Student 1</th>
                            <th>📚 Section</th>
                            <th>👤 Student 2</th>
                            <th>📚 Section</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        classroomSeats.forEach(row => {
            html += `
                <tr>
                    <td>${row.bench}</td>
                    <td>${row.seat1.rollNo}</td>
                    <td>${row.seat1.section}</td>
                    <td>${row.seat2 ? row.seat2.rollNo : '-'}</td>
                    <td>${row.seat2 ? row.seat2.section : '-'}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table></div>';
    });
    
    document.getElementById('tableContainer').innerHTML = html;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function shuffleArrangement() {
    if (!confirm('🔀 This will shuffle the classroom assignments and update Firebase. Continue?')) {
        return;
    }
    
    const shuffledSections = shuffleArray(sections);
    const classroomMapping = {};
    sections.forEach((sec, idx) => {
        classroomMapping[sec.name] = shuffledSections[idx].name;
    });
    
    seatingData.forEach(seat => {
        seat.classroom = classroomMapping[seat.classroom];
    });
    
    sections = shuffledSections;
    
    sessionStorage.setItem('seatingData', JSON.stringify(seatingData));
    sessionStorage.setItem('sections', JSON.stringify(sections));
    
    clearAllArrangements().then(() => {
        const savePromises = seatingData.map(seat => {
            const rollMatch = seat.seat1.rollNo.match(/([0-9a-z]{4})$/i);
            const rollNumber = rollMatch ? rollMatch[1].toLowerCase() : seat.seat1.rollNo;
            
            return saveSeatingArrangement({
                rollNumber: rollNumber,
                fullRollNo: seat.seat1.rollNo,
                section: seat.seat1.section,
                classroom: seat.classroom,
                bench: seat.bench,
                partner: seat.seat2 ? seat.seat2.rollNo : null,
                partnerSection: seat.seat2 ? seat.seat2.section : null,
                subject: seat.seat1.subject,
                examDate: examDate,
                examTime: examTime
            });
        });
        
        return Promise.all(savePromises);
    }).then(() => {
        alert('✅ Shuffled and saved to Firebase successfully!');
        displayResults();
    }).catch(error => {
        alert('❌ Error: ' + error.message);
    });
}
