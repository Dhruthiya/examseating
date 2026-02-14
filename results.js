let seatingData = [];
let overflowData = [];

// Load data from sessionStorage
window.onload = function() {
    const storedSeatingData = sessionStorage.getItem('seatingData');
    const storedOverflowData = sessionStorage.getItem('overflowData');
    const storedSections = sessionStorage.getItem('sections');
    
    if (!storedSeatingData) {
        alert('No seating data found. Redirecting to main page.');
        window.location.href = 'index.html';
        return;
    }
    
    seatingData = JSON.parse(storedSeatingData);
    overflowData = JSON.parse(storedOverflowData);
    const sections = JSON.parse(storedSections);
    
    displayClassroomTables(seatingData, sections);
    
    if (overflowData.length > 0) {
        const additionalClassrooms = Math.ceil(overflowData.length / 64);
        displayOverflow(overflowData, additionalClassrooms);
    }
};

function displayClassroomTables(seatingData, sections) {
    let html = '<h2>🏫 Seating Arrangement by Classroom</h2>';
    
    sections.forEach(classroom => {
        const classroomSeats = seatingData.filter(row => row.classroom === classroom.name);
        if (classroomSeats.length === 0) return;
        
        const firstHalf = classroomSeats.slice(0, 16);
        const secondHalf = classroomSeats.slice(16, 32);
        
        html += `
            <div class="classroom-table" style="margin-top: 30px;">
                <h3>🚪 ${classroom.name}</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 10px;">
                    <table>
                        <thead>
                            <tr>
                                <th>🪑 Bench</th>
                                <th>👤 Student 1 Roll Number</th>
                                <th>📚 Student 1 Section</th>
                                <th>👤 Student 2 Roll Number</th>
                                <th>📚 Student 2 Section</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        firstHalf.forEach(row => {
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
        
        html += `
                        </tbody>
                    </table>
                    <table>
                        <thead>
                            <tr>
                                <th>🪑 Bench</th>
                                <th>👤 Student 1 Roll Number</th>
                                <th>📚 Student 1 Section</th>
                                <th>👤 Student 2 Roll Number</th>
                                <th>📚 Student 2 Section</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        secondHalf.forEach(row => {
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
        
        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    });
    
    document.getElementById('tableContainer').innerHTML = html;
}

function displayOverflow(students, additionalClassrooms) {
    const overflowSeating = allocateOverflowSeats(students, additionalClassrooms);
    
    const roomGroups = {};
    overflowSeating.forEach(row => {
        const roomName = `Overflow-Class-${row.classroom}`;
        if (!roomGroups[roomName]) roomGroups[roomName] = [];
        roomGroups[roomName].push(row);
    });
    
    const actualClassroomsUsed = Object.keys(roomGroups).length;
    
    let html = `<div style="margin-top: 40px; padding: 25px; background: linear-gradient(135deg, #fff3cd 0%, #ffe8a1 100%); border-radius: 15px; border: 2px solid #ffc107; box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);">
        <h3 style="color: #856404; font-size: 1.4em; margin-bottom: 10px;">⚠️ Additional Classrooms Needed: ${actualClassroomsUsed}</h3>
        <p style="color: #856404; font-size: 1.1em;">📊 Total overflow students: ${students.length}</p>
    </div>`;
    
    // Sort room names numerically
    const sortedRoomNames = Object.keys(roomGroups).sort((a, b) => {
        const numA = parseInt(a.split('-')[2]);
        const numB = parseInt(b.split('-')[2]);
        return numA - numB;
    });
    
    sortedRoomNames.forEach(roomName => {
        const roomSeats = roomGroups[roomName];
        const firstHalf = roomSeats.slice(0, 16);
        const secondHalf = roomSeats.slice(16, 32);
        
        html += `
            <div class="classroom-table" style="margin-top: 30px;">
                <h3 style="background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); box-shadow: 0 4px 15px rgba(255, 193, 7, 0.4);">🏫 ${roomName}</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 10px;">
                    <table>
                        <thead>
                            <tr>
                                <th>🪑 Bench</th>
                                <th>👤 Student 1 Roll Number</th>
                                <th>📚 Student 1 Section</th>
                                <th>👤 Student 2 Roll Number</th>
                                <th>📚 Student 2 Section</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        firstHalf.forEach(row => {
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
        
        html += `
                        </tbody>
                    </table>
                    <table>
                        <thead>
                            <tr>
                                <th>🪑 Bench</th>
                                <th>👤 Student 1 Roll Number</th>
                                <th>📚 Student 1 Section</th>
                                <th>👤 Student 2 Roll Number</th>
                                <th>📚 Student 2 Section</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        secondHalf.forEach(row => {
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
        
        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    });
    
    document.getElementById('tableContainer').innerHTML += html;
}

function allocateOverflowSeats(students, classrooms) {
    const result = [];
    let currentRoom = 1;
    let currentBench = 1;
    
    const remaining = [...students];
    
    while (remaining.length > 0) {
        const student1 = remaining.shift();
        let student2 = null;
        
        // Try to find a partner with different subject
        for (let j = 0; j < remaining.length; j++) {
            if (remaining[j].subject !== student1.subject) {
                student2 = remaining[j];
                remaining.splice(j, 1);
                break;
            }
        }
        
        result.push({
            classroom: currentRoom,
            bench: currentBench,
            seat1: student1,
            seat2: student2
        });
        
        currentBench++;
        if (currentBench > 32) {
            currentRoom++;
            currentBench = 1;
        }
    }
    
    return result;
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.text('Exam Seating Arrangement', 14, 15);
    
    const tableData = seatingData.map(row => [
        row.classroom,
        row.bench,
        row.seat1.rollNo,
        row.seat1.name,
        row.seat1.section,
        row.seat1.subject,
        row.seat2 ? row.seat2.rollNo : '-',
        row.seat2 ? row.seat2.name : '-',
        row.seat2 ? row.seat2.section : '-',
        row.seat2 ? row.seat2.subject : '-'
    ]);
    
    doc.autoTable({
        head: [['Room', 'Bench', 'Roll', 'Name', 'Section', 'Subject', 'Roll', 'Name', 'Section', 'Subject']],
        body: tableData,
        startY: 20,
        styles: { fontSize: 7 }
    });
    
    if (overflowData.length > 0) {
        doc.addPage();
        doc.text('Overflow Students - Additional Classrooms', 14, 15);
        const additionalClassrooms = Math.ceil(overflowData.length / 64);
        const overflowSeating = allocateOverflowSeats(overflowData, additionalClassrooms);
        
        const overflowTableData = overflowSeating.map(row => [
            `Class ${row.classroom}`,
            row.bench,
            row.seat1.rollNo,
            row.seat1.name,
            row.seat1.section,
            row.seat1.subject,
            row.seat2 ? row.seat2.rollNo : '-',
            row.seat2 ? row.seat2.name : '-',
            row.seat2 ? row.seat2.section : '-',
            row.seat2 ? row.seat2.subject : '-'
        ]);
        
        doc.autoTable({
            head: [['Room', 'Bench', 'Roll', 'Name', 'Section', 'Subject', 'Roll', 'Name', 'Section', 'Subject']],
            body: overflowTableData,
            startY: 25,
            styles: { fontSize: 7 }
        });
    }
    
    doc.save('seating-arrangement.pdf');
}

function downloadExcel() {
    const data = seatingData.map(row => ({
        'Classroom': row.classroom,
        'Bench': row.bench,
        'Seat1 Roll No': row.seat1.rollNo,
        'Seat1 Name': row.seat1.name,
        'Seat1 Section': row.seat1.section,
        'Seat1 Subject': row.seat1.subject,
        'Seat2 Roll No': row.seat2 ? row.seat2.rollNo : '-',
        'Seat2 Name': row.seat2 ? row.seat2.name : '-',
        'Seat2 Section': row.seat2 ? row.seat2.section : '-',
        'Seat2 Subject': row.seat2 ? row.seat2.subject : '-'
    }));
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Main Seating');
    
    if (overflowData.length > 0) {
        const additionalClassrooms = Math.ceil(overflowData.length / 64);
        const overflowSeating = allocateOverflowSeats(overflowData, additionalClassrooms);
        
        const overflowExcelData = overflowSeating.map(row => ({
            'Classroom': `Class ${row.classroom}`,
            'Bench': row.bench,
            'Seat1 Roll No': row.seat1.rollNo,
            'Seat1 Name': row.seat1.name,
            'Seat1 Section': row.seat1.section,
            'Seat1 Subject': row.seat1.subject,
            'Seat2 Roll No': row.seat2 ? row.seat2.rollNo : '-',
            'Seat2 Name': row.seat2 ? row.seat2.name : '-',
            'Seat2 Section': row.seat2 ? row.seat2.section : '-',
            'Seat2 Subject': row.seat2 ? row.seat2.subject : '-'
        }));
        
        const ws2 = XLSX.utils.json_to_sheet(overflowExcelData);
        XLSX.utils.book_append_sheet(wb, ws2, 'Overflow Seating');
    }
    
    XLSX.writeFile(wb, 'seating-arrangement.xlsx');
}
