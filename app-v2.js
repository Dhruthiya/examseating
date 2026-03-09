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

function toggleBranch(branch) {
    const btn = document.querySelector(`[data-branch="${branch}"]`);
    
    if (selectedBranches.has(branch)) {
        selectedBranches.delete(branch);
        btn.classList.remove('selected');
        delete selectedSubjects[branch];
    } else {
        selectedBranches.add(branch);
        btn.classList.add('selected');
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
            <select id="subject-${branch}" onchange="selectSubject('${branch}', this.value)">
                <option value="">Select Subject</option>
                ${branchData[branch].subjects.map(subject => `
                    <option value="${subject}">${subject}</option>
                `).join('')}
            </select>
        `;
        container.appendChild(div);
    });
    
    document.getElementById('examDetailsSection').style.display = selectedBranches.size > 0 ? 'block' : 'none';
    document.getElementById('examTimeSection').style.display = selectedBranches.size > 0 ? 'block' : 'none';
}

function selectSubject(branch, subject) {
    selectedSubjects[branch] = subject;
}

function generateArrangement() {
    if (selectedBranches.size === 0) {
        alert('⚠️ Please select at least one branch');
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
                    section: sectionName,
                    subject: subject
                });
            }
        });
    });
    
    const result = allocateSeatsToClassrooms(students, sections);
    
    sessionStorage.setItem('seatingData', JSON.stringify(result.seated));
    sessionStorage.setItem('overflowData', JSON.stringify(result.overflow));
    sessionStorage.setItem('sections', JSON.stringify(sections));
    sessionStorage.setItem('examDate', examDate);
    sessionStorage.setItem('examTime', examTime);
    
    clearAllArrangements().then(() => {
        const savePromises = result.seated.map(seat => {
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
        window.location.href = 'results-v2.html';
    }).catch(error => {
        alert('Error: ' + error.message);
    });
}

function generateRollNumbers(branch) {
    const rolls = [];
    
    if (branch === 'CSE') {
        for (let i = 1; i <= 64; i++) {
            rolls.push(`25wh1a05${i.toString().padStart(2, '0')}`);
        }
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
        rolls.push('25wh1a05c9');
        for (let letter = 'd'.charCodeAt(0); letter <= 'k'.charCodeAt(0); letter++) {
            for (let num = 0; num <= 9; num++) {
                rolls.push(`25wh1a05${String.fromCharCode(letter)}${num}`);
                if (rolls.length >= 193) break;
            }
            if (rolls.length >= 193) break;
        }
        for (let letter = 'k'.charCodeAt(0); letter <= 'r'.charCodeAt(0); letter++) {
            let start = (letter === 'k'.charCodeAt(0)) ? 4 : 0;
            for (let num = start; num <= 9; num++) {
                rolls.push(`25wh1a05${String.fromCharCode(letter)}${num}`);
                if (rolls.length >= 257) break;
            }
            if (rolls.length >= 257) break;
        }
        for (let letter = 'r'.charCodeAt(0); letter <= 'z'.charCodeAt(0); letter++) {
            let start = (letter === 'r'.charCodeAt(0)) ? 8 : 0;
            for (let num = start; num <= 9; num++) {
                rolls.push(`25wh1a05${String.fromCharCode(letter)}${num}`);
                if (rolls.length >= 321) break;
            }
            if (rolls.length >= 321) break;
        }
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
        for (let i = 1; i <= 64; i++) {
            rolls.push(`25wh1a55${i.toString().padStart(2, '0')}`);
        }
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
        for (let i = 1; i <= 64; i++) {
            rolls.push(`25wh1a66${i.toString().padStart(2, '0')}`);
        }
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
    
    return { seated: result, overflow: overflow };
}
