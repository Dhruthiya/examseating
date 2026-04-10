// Firebase imports will be handled differently
// import { saveSeatingArrangement, clearAllArrangements } from './firebase-config.js';

let seatingData = [];
let overflowData = [];
let selectedBranchCount = 0;
let selectedYear = '';
let selectedMid = '';
window.isSavingData = false;

const branchData = {
    CSE: {
        sections: ['CSE-A', 'CSE-B', 'CSE-C', 'CSE-D', 'CSE-E', 'CSE-F'],
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

function selectYear(year) {
    selectedYear = year;
    document.querySelectorAll('#generateTableView .count-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Show mid selection
    document.getElementById('midSelectionSection').style.display = 'block';
    
    // Reset mid and subsequent selections
    selectedMid = '';
    document.querySelectorAll('#midSelectionSection .count-btn').forEach(btn => btn.classList.remove('selected'));
}

function selectMid(mid) {
    selectedMid = mid;
    document.querySelectorAll('#midSelectionSection .count-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

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
    checkIfReadyToGenerate();
}

function checkIfReadyToGenerate() {
    const examDate = document.getElementById('examDate')?.value;
    const examTime = document.getElementById('examTime')?.value;
    
    const allSubjectsSelected = selectedBranches.size > 0 && 
        Array.from(selectedBranches).every(branch => selectedSubjects[branch]);
    
    const generateBtn = document.getElementById('generateButtonSection');
    if (selectedYear && allSubjectsSelected && examDate && examTime) {
        generateBtn.style.display = 'block';
    } else {
        generateBtn.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const examDateInput = document.getElementById('examDate');
    const displayDate = document.getElementById('displayDate');
    const examTimeInput = document.getElementById('examTime');
    
    examDateInput?.addEventListener('change', function() {
        if (this.value) {
            const [year, month, day] = this.value.split('-');
            displayDate.textContent = `Selected: ${day}/${month}/${year}`;
        }
        checkIfReadyToGenerate();
    });
    
    examTimeInput?.addEventListener('change', function() {
        checkIfReadyToGenerate();
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
    console.log('🔵 Generate button clicked');
    
    if (!selectedYear) {
        alert('⚠️ Please select a year');
        return;
    }
    
    if (!selectedMid) {
        alert('⚠️ Please select a mid');
        return;
    }
    
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
    
    console.log('✅ All validations passed');
    console.log('Selected year:', selectedYear);
    console.log('Selected mid:', selectedMid);
    console.log('Selected branches:', Array.from(selectedBranches));
    console.log('Selected subjects:', selectedSubjects);
    
    const [year, month, day] = examDateInput.split('-');
    const examDate = `${day}/${month}/${year}`;
    
    const sections = [];
    const students = [];
    
    const branchOrder = ['CSE', 'ECE', 'AIML', 'EEE'];
    
    branchOrder.forEach(branch => {
        if (!selectedBranches.has(branch)) return;
        
        const subject = selectedSubjects[branch];
        
        branchData[branch].sections.forEach((sectionName) => {
            const fullSectionName = `${selectedYear} ${sectionName}`;
            const rollNumbers = ROLL_NUMBERS[fullSectionName] || [];
            
            if (rollNumbers.length > 0) {
                sections.push({ name: sectionName, subject: subject });
                
                rollNumbers.forEach(rollNo => {
                    students.push({
                        rollNo: rollNo,
                        name: rollNo,
                        section: sectionName,
                        subject: subject
                    });
                });
            }
        });
    });
    
    const result = allocateSeatsToClassrooms(students, sections);
    console.log('🔵 Allocation complete. Seated:', result.seated.length, 'Overflow:', result.overflow.length);
    
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
    
    // Store table metadata
    const tableMetadata = {
        year: selectedYear,
        mid: selectedMid,
        branches: Array.from(selectedBranches),
        subjects: selectedSubjects,
        examDate: examDate,
        examTime: examTime,
        examDateISO: examDateInput
    };
    
    localStorage.setItem('seatingData', JSON.stringify(result.seated));
    localStorage.setItem('overflowData', JSON.stringify(result.overflow));
    localStorage.setItem('sections', JSON.stringify(finalSections));
    localStorage.setItem('examDate', examDate);
    localStorage.setItem('examTime', examTime);
    localStorage.setItem('tableMetadata', JSON.stringify(tableMetadata));
    
    sessionStorage.setItem('seatingData', JSON.stringify(result.seated));
    sessionStorage.setItem('overflowData', JSON.stringify(result.overflow));
    sessionStorage.setItem('sections', JSON.stringify(finalSections));
    sessionStorage.setItem('examDate', examDate);
    sessionStorage.setItem('examTime', examTime);
    
    // Don't save to Firebase, just go to results page
    window.location.href = 'results.html';
}

function generateRollNumbers(branch) {
    // Use the ROLL_NUMBERS data from rollnumbers.js
    const rolls = [];
    
    // Get all sections for this branch from ROLL_NUMBERS
    Object.keys(ROLL_NUMBERS).forEach(key => {
        if (key.includes(branch)) {
            rolls.push(...ROLL_NUMBERS[key]);
        }
    });
    
    return rolls;
}

function allocateSeatsToClassrooms(students, sections) {
    const BENCHES_PER_CLASSROOM = 28; // 7 rows × 4 columns
    
    const seated = new Set();
    const allBenches = [];
    let benchCounter = 1;
    
    // Group students by subject
    const studentsBySubject = {};
    students.forEach(student => {
        if (!studentsBySubject[student.subject]) {
            studentsBySubject[student.subject] = [];
        }
        studentsBySubject[student.subject].push(student);
    });
    
    const subjects = Object.keys(studentsBySubject);
    console.log('Subjects:', subjects);
    console.log('Students per subject:', Object.keys(studentsBySubject).map(s => `${s}: ${studentsBySubject[s].length}`));
    
    // PHASE 1: Pair students with DIFFERENT subjects
    for (let i = 0; i < subjects.length; i++) {
        for (let j = i + 1; j < subjects.length; j++) {
            const subject1 = subjects[i];
            const subject2 = subjects[j];
            const list1 = studentsBySubject[subject1];
            const list2 = studentsBySubject[subject2];
            
            while (list1.length > 0 && list2.length > 0) {
                const student1 = list1.shift();
                const student2 = list2.shift();
                
                if (student1.section === student2.section) {
                    list2.unshift(student2); // Put back and try next
                    if (list2.length === 1) break; // No other options
                    continue;
                }
                
                allBenches.push({
                    bench: benchCounter++,
                    seat1: student1,
                    seat2: student2
                });
                seated.add(student1.rollNo);
                seated.add(student2.rollNo);
                console.log(`✅ Paired: ${student1.rollNo} (${student1.subject}) with ${student2.rollNo} (${student2.subject})`);
            }
        }
    }
    
    // PHASE 2: Place remaining students ALONE
    students.forEach(student => {
        if (!seated.has(student.rollNo)) {
            allBenches.push({
                bench: benchCounter++,
                seat1: student,
                seat2: null
            });
            seated.add(student.rollNo);
            console.log(`⚠️ Alone: ${student.rollNo} (${student.subject}) - no different subject partner available`);
        }
    });
    
    // PHASE 3: Distribute benches across classrooms
    const classrooms = {};
    sections.forEach(s => {
        classrooms[s.name] = { benches: [] };
    });
    
    let classroomIndex = 0;
    allBenches.forEach((bench, idx) => {
        const classroom = sections[classroomIndex];
        const room = classrooms[classroom.name];
        
        room.benches.push({
            bench: (room.benches.length + 1),
            seat1: bench.seat1,
            seat2: bench.seat2
        });
        
        // Move to next classroom after 28 benches
        if (room.benches.length >= BENCHES_PER_CLASSROOM) {
            classroomIndex++;
        }
    });
    
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
    
    console.log(`📊 Total benches used: ${allBenches.length}`);
    console.log(`📊 Rooms needed: ${Math.ceil(allBenches.length / BENCHES_PER_CLASSROOM)}`);
    
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


// Load all tables from Firebase
async function loadAllTables() {
    const container = document.getElementById('tablesContainer');
    container.innerHTML = '<p>Loading tables...</p>';
    
    try {
        const snapshot = await db.collection('examTables').get();
        
        if (snapshot.empty) {
            container.innerHTML = '<p style="text-align: center; color: #999;">No tables generated yet.</p>';
            return;
        }
        
        // Auto-delete past tables
        const today = new Date().setHours(0, 0, 0, 0);
        const deletePromises = [];
        
        container.innerHTML = '';
        snapshot.forEach(doc => {
            const table = doc.data();
            const tableDate = new Date(table.examDate).setHours(0, 0, 0, 0);
            
            // Delete if date has passed
            if (tableDate < today) {
                deletePromises.push(doc.ref.delete());
                return;
            }
            
            // Display table card
            const card = document.createElement('div');
            card.className = 'table-card';
            card.innerHTML = `
                <h3 style="margin: 0 0 10px 0;">${table.tableName}</h3>
                <p style="margin: 5px 0;"><strong>Year:</strong> ${table.year} | <strong>Mid:</strong> ${table.mid}</p>
                <p style="margin: 5px 0;"><strong>Branches:</strong> ${table.branches.join(', ')}</p>
                <p style="margin: 5px 0;"><strong>Subjects:</strong> ${Object.values(table.subjects).join(', ')}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${table.examDate} | <strong>Time:</strong> ${table.examTime}</p>
                <button onclick="deleteTable('${doc.id}')" style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px;">🗑️ Delete</button>
            `;
            container.appendChild(card);
        });
        
        // Execute deletions
        if (deletePromises.length > 0) {
            await Promise.all(deletePromises);
            console.log(`Deleted ${deletePromises.length} past tables`);
        }
        
        if (container.children.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999;">No active tables.</p>';
        }
    } catch (error) {
        console.error('Error loading tables:', error);
        container.innerHTML = '<p style="color: red;">Error loading tables.</p>';
    }
}

async function deleteTable(tableId) {
    if (!confirm('Are you sure you want to delete this table?')) return;
    
    try {
        await db.collection('examTables').doc(tableId).delete();
        alert('✅ Table deleted successfully!');
        loadAllTables();
    } catch (error) {
        console.error('Error deleting table:', error);
        alert('❌ Error deleting table: ' + error.message);
    }
}
