let seatingData = [];
let overflowData = [];
let selectedBranchCount = 0;

const branchData = {
    CSE: {
        sections: ['CSE-A', 'CSE-B', 'CSE-C', 'CSE-D', 'CSE-E', 'CSE-F'],
        students: [64, 64, 65, 64, 64, 64],
        subjects: [
            'Matrices and calculus',
            'Engineering Chemistry',
            'Programming for Problem solving',
            'English for Enhancement skills',
            'Fundamentals of Electronic Engineering'
        ]
    },
    ECE: {
        sections: ['ECE-A', 'ECE-B'],
        students: [64, 64],
        subjects: [
            'Matrices and calculus',
            'Advanced Engineering Physics',
            'Programming for Problem solving',
            'English for Enhancement skills',
            'Introduction to Electrical Engineering',
            'Engineering Drawing and Computer Aided Drafting'
        ]
    },
    AIML: {
        sections: ['AIML-A', 'AIML-B'],
        students: [64, 64],
        subjects: [
            'Matrices and calculus',
            'Advanced Engineering Physics',
            'Programming for Problem solving',
            'Engineering Drawing and Computer Aided Drafting',
            'Basic Electrical Engineering'
        ]
    },
    EEE: {
        sections: ['EEE-A'],
        students: [64],
        subjects: [
            'Matrices and calculus',
            'Advanced Engineering Physics',
            'Programming for Problem solving',
            'English for Enhancement skills',
            'Electrical Circuits - 1',
            'Engineering Drawing and Computer Aided Drafting'
        ]
    }
};

const selectedBranches = new Set();
const selectedSubjects = {};

function selectBranchCount(count) {
    selectedBranchCount = count;
    document.querySelectorAll('.count-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Reset branch selection when count changes
    selectedBranches.clear();
    Object.keys(selectedSubjects).forEach(key => delete selectedSubjects[key]);
    document.querySelectorAll('.branch-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.disabled = false;
        btn.style.opacity = '1';
    });
    document.getElementById('subjectSelection').innerHTML = '';
}

function toggleBranch(branch) {
    const btn = document.querySelector(`[data-branch="${branch}"]`);
    
    if (selectedBranchCount === 0) {
        alert('⚠️ Please select how many branches first!');
        return;
    }
    
    if (selectedBranches.has(branch)) {
        selectedBranches.delete(branch);
        btn.classList.remove('selected');
        delete selectedSubjects[branch];
        
        // Re-enable all branch buttons
        document.querySelectorAll('.branch-btn').forEach(b => {
            b.disabled = false;
            b.style.opacity = '1';
        });
    } else {
        if (selectedBranches.size >= selectedBranchCount) {
            alert(`❌ You can only select ${selectedBranchCount} branch(es)!`);
            btn.classList.add('error-shake');
            setTimeout(() => btn.classList.remove('error-shake'), 500);
            return;
        }
        selectedBranches.add(branch);
        btn.classList.add('selected');
        
        // Disable unselected buttons if limit reached
        if (selectedBranches.size >= selectedBranchCount) {
            document.querySelectorAll('.branch-btn').forEach(b => {
                if (!b.classList.contains('selected')) {
                    b.disabled = true;
                    b.style.opacity = '0.4';
                }
            });
        }
    }
    updateSubjectSelection();
}

function updateSubjectSelection() {
    const container = document.getElementById('subjectSelection');
    container.innerHTML = '';
    
    selectedBranches.forEach(branch => {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `
            <label>📖 ${branch} - Subject:</label>
            <select id="subject-${branch}" onchange="selectSubject('${branch}', this.value)" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px;">
                <option value="">Select Subject</option>
                ${branchData[branch].subjects.map(subject => `
                    <option value="${subject}">${subject}</option>
                `).join('')}
            </select>
        `;
        container.appendChild(div);
    });
    
    // Show date/time fields when subjects are loaded
    document.getElementById('examDetailsSection').style.display = selectedBranches.size > 0 ? 'block' : 'none';
    document.getElementById('examTimeSection').style.display = selectedBranches.size > 0 ? 'block' : 'none';
}

function selectSubject(branch, subject) {
    selectedSubjects[branch] = subject;
}

document.addEventListener('DOMContentLoaded', function() {
    const examDateInput = document.getElementById('examDate');
    const displayDate = document.getElementById('displayDate');
    
    examDateInput?.addEventListener('change', function() {
        if (this.value) {
            const [year, month, day] = this.value.split('-');
            displayDate.textContent = `Selected: ${day}/${month}/${year}`;
        }
    });
});

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function generateArrangement(enableShuffle = false) {
    if (selectedBranchCount === 0) {
        alert('⚠️ Please select how many branches are having the exam');
        return;
    }
    
    if (selectedBranches.size === 0) {
        alert('⚠️ Please select at least one branch');
        return;
    }
    
    if (selectedBranches.size !== selectedBranchCount) {
        alert(`⚠️ Please select exactly ${selectedBranchCount} branch(es)`);
        return;
    }
    
    for (let branch of selectedBranches) {
        if (!selectedSubjects[branch]) {
            alert(`Please select a subject for ${branch}`);
            return;
        }
    }
    
    const examDateInput = document.getElementById('examDate').value;
    const examTime = document.getElementById('examTime').value;
    
    if (!examDateInput || !examTime) {
        alert('⚠️ Please enter exam date and time');
        return;
    }
    
    // Convert date from yyyy-mm-dd to dd/mm/yyyy
    const [year, month, day] = examDateInput.split('-');
    const examDate = `${day}/${month}/${year}`;
    
    const sections = [];
    const students = [];
    
    const branchOrder = ['CSE', 'ECE', 'AIML', 'EEE'];
    
    branchOrder.forEach(branch => {
        if (!selectedBranches.has(branch)) return;
        
        const subject = selectedSubjects[branch];
        const rollNumbers = generateRollNumbers(branch);
        
        branchData[branch].sections.forEach((sectionName, idx) => {
            sections.push({ name: sectionName, subject: subject });
            const numStudents = branchData[branch].students[idx];
            const startIdx = branchData[branch].sections.slice(0, idx).reduce((sum, _, i) => sum + branchData[branch].students[i], 0);
            
            for (let j = 0; j < numStudents; j++) {
                students.push({
                    rollNo: rollNumbers[startIdx + j],
                    name: rollNumbers[startIdx + j],
                    section: sectionName,
                    subject: subject
                });
            }
        });
    });
    
    const result = allocateSeatsToClassrooms(students, sections);
    
    let finalSections = sections;
    
    if (enableShuffle) {
        const shuffledSections = shuffleArray(sections);
        const classroomMapping = {};
        sections.forEach((sec, idx) => {
            classroomMapping[sec.name] = shuffledSections[idx].name;
        });
        
        result.seated.forEach(seat => {
            seat.classroom = classroomMapping[seat.classroom];
        });
        
        finalSections = shuffledSections;
    }
    
    localStorage.setItem('seatingData', JSON.stringify(result.seated));
    localStorage.setItem('overflowData', JSON.stringify(result.overflow));
    localStorage.setItem('sections', JSON.stringify(finalSections));
    localStorage.setItem('examDate', examDate);
    localStorage.setItem('examTime', examTime);
    
    sessionStorage.setItem('seatingData', JSON.stringify(result.seated));
    sessionStorage.setItem('overflowData', JSON.stringify(result.overflow));
    sessionStorage.setItem('sections', JSON.stringify(finalSections));
    
    window.location.href = 'results.html';
}

function generateRollNumbers(branch) {
    const rolls = [];
    
    if (branch === 'CSE') {
        // CSE-A: 25wh1a0501 to 25wh1a0564
        for (let i = 1; i <= 64; i++) {
            rolls.push(`25wh1a05${i.toString().padStart(2, '0')}`);
        }
        
        // CSE-B: 25wh1a0565 to 25wh1a0599 (35 students) + 25wh1a05a0 to 25wh1a05c8 (29 students)
        for (let i = 65; i <= 99; i++) {
            rolls.push(`25wh1a05${i}`);
        }
        for (let letter = 'a'.charCodeAt(0); letter <= 'c'.charCodeAt(0); letter++) {
            for (let num = 0; num <= 9; num++) {
                rolls.push(`25wh1a05${String.fromCharCode(letter)}${num}`);
                if (rolls.length >= 128) break;
            }
            if (rolls.length >= 128) break;
        }
        
        // CSE-C: 25wh1a05c9 to 25wh1a05k3 (65 students)
        rolls.push('25wh1a05c9');
        for (let letter = 'd'.charCodeAt(0); letter <= 'k'.charCodeAt(0); letter++) {
            for (let num = 0; num <= 9; num++) {
                rolls.push(`25wh1a05${String.fromCharCode(letter)}${num}`);
                if (rolls.length >= 193) break;
            }
            if (rolls.length >= 193) break;
        }
        
        // CSE-D: 25wh1a05k4 to 25wh1a05r7 (64 students)
        for (let letter = 'k'.charCodeAt(0); letter <= 'r'.charCodeAt(0); letter++) {
            let start = (letter === 'k'.charCodeAt(0)) ? 4 : 0;
            for (let num = start; num <= 9; num++) {
                rolls.push(`25wh1a05${String.fromCharCode(letter)}${num}`);
                if (rolls.length >= 257) break;
            }
            if (rolls.length >= 257) break;
        }
        
        // CSE-E: 25wh1a05r8 to 25wh1a05z1 (64 students)
        for (let letter = 'r'.charCodeAt(0); letter <= 'z'.charCodeAt(0); letter++) {
            let start = (letter === 'r'.charCodeAt(0)) ? 8 : 0;
            for (let num = start; num <= 9; num++) {
                rolls.push(`25wh1a05${String.fromCharCode(letter)}${num}`);
                if (rolls.length >= 321) break;
            }
            if (rolls.length >= 321) break;
        }
        
        // CSE-F: 25wh1a05z2 to 25wh1a05z9 (8 students) + 25wh1a05aa to 25wh1a05cj (56 students)
        for (let num = 2; num <= 9; num++) {
            rolls.push(`25wh1a05z${num}`);
        }
        for (let letter1 = 'a'.charCodeAt(0); letter1 <= 'c'.charCodeAt(0); letter1++) {
            for (let letter2 = 'a'.charCodeAt(0); letter2 <= 'z'.charCodeAt(0); letter2++) {
                rolls.push(`25wh1a05${String.fromCharCode(letter1)}${String.fromCharCode(letter2)}`);
                if (rolls.length >= 385) break;
            }
            if (rolls.length >= 385) break;
        }
        
    } else if (branch === 'ECE') {
        // ECE-A: 25wh1a5501 to 25wh1a5564
        for (let i = 1; i <= 64; i++) {
            rolls.push(`25wh1a55${i.toString().padStart(2, '0')}`);
        }
        
        // ECE-B: 25wh1a5565 to 25wh1a5599 (35 students) + 25wh1a55a0 to 25wh1a55c8 (29 students)
        for (let i = 65; i <= 99; i++) {
            rolls.push(`25wh1a55${i}`);
        }
        for (let letter = 'a'.charCodeAt(0); letter <= 'c'.charCodeAt(0); letter++) {
            for (let num = 0; num <= 9; num++) {
                rolls.push(`25wh1a55${String.fromCharCode(letter)}${num}`);
                if (rolls.length >= 128) break;
            }
            if (rolls.length >= 128) break;
        }
        
    } else if (branch === 'AIML') {
        // AIML-A: 25wh1a6601 to 25wh1a6664
        for (let i = 1; i <= 64; i++) {
            rolls.push(`25wh1a66${i.toString().padStart(2, '0')}`);
        }
        
        // AIML-B: 25wh1a6665 to 25wh1a6699 (35 students) + 25wh1a66a0 to 25wh1a66c8 (29 students)
        for (let i = 65; i <= 99; i++) {
            rolls.push(`25wh1a66${i}`);
        }
        for (let letter = 'a'.charCodeAt(0); letter <= 'c'.charCodeAt(0); letter++) {
            for (let num = 0; num <= 9; num++) {
                rolls.push(`25wh1a66${String.fromCharCode(letter)}${num}`);
                if (rolls.length >= 128) break;
            }
            if (rolls.length >= 128) break;
        }
        
    } else if (branch === 'EEE') {
        // EEE: 25wh1a4401 to 25wh1a4464
        for (let i = 1; i <= 64; i++) {
            rolls.push(`25wh1a44${i.toString().padStart(2, '0')}`);
        }
    }
    
    return rolls;
}

function allocateSeatsToClassrooms(students, sections) {
    const classrooms = {};
    sections.forEach(s => {
        classrooms[s.name] = { benches: [] };
    });
    
    const seated = new Set();
    const getBranch = (section) => section.split('-')[0];
    
    // PASS 1: Fill seat1 for each classroom with available students
    for (let classroom of sections) {
        const room = classrooms[classroom.name];
        let benchNum = 1;
        
        for (let i = 0; i < students.length && benchNum <= 32; i++) {
            const student = students[i];
            
            if (seated.has(student.rollNo)) continue;
            if (student.section === classroom.name) continue;
            
            room.benches.push({
                bench: benchNum++,
                seat1: student,
                seat2: null
            });
            seated.add(student.rollNo);
        }
    }
    
    // PASS 2: Fill seat2 with different branch students
    for (let classroom of sections) {
        const room = classrooms[classroom.name];
        
        for (let bench of room.benches) {
            const seat1Branch = getBranch(bench.seat1.section);
            
            for (let i = 0; i < students.length; i++) {
                const student = students[i];
                
                if (seated.has(student.rollNo)) continue;
                if (student.section === classroom.name) continue;
                if (getBranch(student.section) === seat1Branch) continue;
                if (student.subject === bench.seat1.subject) continue;
                
                bench.seat2 = student;
                seated.add(student.rollNo);
                break;
            }
        }
    }
    
    const result = [];
    sections.forEach(classroom => {
        classrooms[classroom.name].benches.forEach(bench => {
            result.push({
                classroom: classroom.name,
                bench: bench.bench,
                seat1: bench.seat1,
                seat2: bench.seat2
            });
        });
    });
    
    const overflow = students.filter(s => !seated.has(s.rollNo));
    overflow.sort((a, b) => {
        if (!a.rollNo || !b.rollNo) return 0;
        return a.rollNo.localeCompare(b.rollNo);
    });
    
    return { seated: result, overflow: overflow };
}

function displayClassroomTables(seatingData, sections) {
    let html = '<h2>🏫 Seating Arrangement by Classroom</h2>';
    
    sections.forEach(classroom => {
        const classroomSeats = seatingData.filter(row => row.classroom === classroom.name);
        if (classroomSeats.length === 0) return;
        
        html += `
            <div class="classroom-table" style="margin-top: 30px;">
                <h3>🚪 ${classroom.name}</h3>
                <table style="margin-top: 10px;">
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

function displayOverflow(students, additionalClassrooms) {
    let html = `<div style="margin-top: 40px; padding: 25px; background: linear-gradient(135deg, #fff3cd 0%, #ffe8a1 100%); border-radius: 15px; border: 2px solid #ffc107; box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);">
        <h3 style="color: #856404; font-size: 1.4em; margin-bottom: 10px;">⚠️ Additional Classrooms Needed: ${additionalClassrooms}</h3>
        <p style="color: #856404; font-size: 1.1em;">📊 Total overflow students: ${students.length}</p>
    </div>`;
    
    const overflowSeating = allocateOverflowSeats(students, additionalClassrooms);
    
    const roomGroups = {};
    overflowSeating.forEach(row => {
        const roomName = `Overflow-Class-${row.classroom}`;
        if (!roomGroups[roomName]) roomGroups[roomName] = [];
        roomGroups[roomName].push(row);
    });
    
    Object.keys(roomGroups).sort().forEach(roomName => {
        const roomSeats = roomGroups[roomName];
        
        html += `
            <div class="classroom-table" style="margin-top: 30px;">
                <h3 style="background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); box-shadow: 0 4px 15px rgba(255, 193, 7, 0.4);">🏫 ${roomName}</h3>
                <table style="margin-top: 10px;">
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
        
        roomSeats.forEach(row => {
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

function displayClasswiseTables(mainSeating, overflow) {
    const classroomData = {};
    
    mainSeating.forEach(row => {
        const classroom = row.classroom;
        if (!classroomData[classroom]) classroomData[classroom] = [];
        
        classroomData[classroom].push({
            rollNo: row.seat1.rollNo,
            section: row.seat1.section,
            benchPartnerRoll: row.seat2 ? row.seat2.rollNo : '-',
            benchPartnerSection: row.seat2 ? row.seat2.section : '-'
        });
        
        if (row.seat2) {
            classroomData[classroom].push({
                rollNo: row.seat2.rollNo,
                section: row.seat2.section,
                benchPartnerRoll: row.seat1.rollNo,
                benchPartnerSection: row.seat1.section
            });
        }
    });
    
    if (overflow.length > 0) {
        const additionalClassrooms = Math.ceil(overflow.length / 64);
        const overflowSeating = allocateOverflowSeats(overflow, additionalClassrooms);
        
        overflowSeating.forEach(row => {
            const classroom = `Class ${row.classroom}`;
            if (!classroomData[classroom]) classroomData[classroom] = [];
            
            classroomData[classroom].push({
                rollNo: row.seat1.rollNo,
                section: row.seat1.section,
                benchPartnerRoll: row.seat2 ? row.seat2.rollNo : '-',
                benchPartnerSection: row.seat2 ? row.seat2.section : '-'
            });
            
            if (row.seat2) {
                classroomData[classroom].push({
                    rollNo: row.seat2.rollNo,
                    section: row.seat2.section,
                    benchPartnerRoll: row.seat1.rollNo,
                    benchPartnerSection: row.seat1.section
                });
            }
        });
    }
    
    let html = '<div style="margin-top: 50px;"><h2>Classwise Student Arrangement</h2>';
    
    Object.keys(classroomData).sort().forEach(classroom => {
        html += `
            <div style="margin-top: 30px;">
                <h3 style="background: #007bff; color: white; padding: 10px; border-radius: 4px;">${classroom}</h3>
                <table style="margin-top: 10px;">
                    <thead>
                        <tr>
                            <th>Student Roll Number</th>
                            <th>Section</th>
                            <th>Bench Partner Roll Number</th>
                            <th>Bench Partner Section</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        classroomData[classroom].forEach(student => {
            html += `
                <tr>
                    <td>${student.rollNo}</td>
                    <td>${student.section}</td>
                    <td>${student.benchPartnerRoll}</td>
                    <td>${student.benchPartnerSection}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table></div>';
    });
    
    html += '</div>';
    document.getElementById('tableContainer').innerHTML += html;
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
