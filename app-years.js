let seatingData = [];
let overflowData = [];
const selectedYears = new Set();
const yearBranchSelections = {};
const selectedSubjects = {};
let selectedSemester = null;

const yearData = {
    1: {
        CSE: {
            sections: ['CSE A1', 'CSE B1', 'CSE C1', 'CSE D1', 'CSE E1', 'CSE F1'],
            students: [64, 64, 65, 64, 64, 64],
            subjects: {
                'I': ['Matrices and Calculus', 'Engineering Chemistry', 'English for Skill Enhancement', 'Electronic Devices and Circuits', 'Programming for Problem Solving'],
                'II': ['Ordinary Differential Equations and Vector Calculus', 'Advanced Engineering Physics', 'Engineering Drawing and Computer Aided Drafting', 'Basic Electrical Engineering', 'Data Structures']
            }
        },
        ECE: {
            sections: ['ECE A1', 'ECE B1'],
            students: [64, 64],
            subjects: {
                'I': ['Matrices and Calculus', 'Programming for Problem Solving', 'English for Skill Enhancement', 'Advanced Engineering Physics', 'Engineering Drawing and Computer Aided Drafting'],
                'II': ['Ordinary Differential Equations and Vector Calculus', 'Engineering Chemistry', 'Network Analysis and Synthesis', 'Python Programming', 'Electronic Devices and Circuits']
            }
        },
        AIML: {
            sections: ['AIML A1', 'AIML B1'],
            students: [64, 64],
            subjects: {
                'I': ['Matrices and Calculus', 'Advanced Engineering Physics', 'Programming for Problem Solving', 'Engineering Drawing and Computer Aided Drafting', 'Basic Electrical Engineering'],
                'II': ['Ordinary Differential Equations and Vector Calculus', 'Engineering Chemistry', 'English for Skill Enhancement', 'Fundamentals of Electronics Engineering', 'Data Structures']
            }
        },
        EEE: {
            sections: ['EEE A1'],
            students: [64],
            subjects: {
                'I': ['Matrices and Calculus', 'Engineering Chemistry', 'C and Data Structures', 'Analog Electronics', 'Electrical Circuits - I'],
                'II': ['Ordinary Differential Equations and Vector Calculus', 'Applied Physics', 'Electromagnetic fields', 'Computer Aided Engineering Graphics', 'Electrical Circuits - II']
            }
        }
    },
    2: {
        CSE: {
            sections: ['CSE A2', 'CSE B2', 'CSE C2', 'CSE D2', 'CSE E2', 'CSE F2'],
            students: [71, 71, 71, 71, 71, 69],
            subjects: {
                'I': ['Discrete Mathematics', 'Computer Organization and Architecture', 'Object Oriented Programming through java', 'Software Engineering', 'Database Management Systems'],
                'II': ['Computer oriented Statistical Methods', 'Operating Systems', 'Algorithm design and Analysis', 'Computer Networks', 'Machine Learning']
            }
        },
        ECE: {
            sections: ['ECE A2', 'ECE B2'],
            students: [64, 64],
            subjects: {
                'I': ['Signals and Systems', 'Digital Logic Design', 'Control Systems', 'Data Structures', 'Numerical Methods and Complex Variables'],
                'II': ['Probability Theory and Stochastic Processes', 'Electromagnetic Fields and Transmission Lines', 'Analog and Digital Communications', 'Electronic Circuit Analysis', 'Linear and Digital IC Applications']
            }
        },
        AIML: {
            sections: ['AIML A2', 'AIML B2'],
            students: [64, 64],
            subjects: {
                'I': ['Mathematical and Statistical Foundations', 'Computer Organization and Architecture', 'Object Oriented Programming through Java', 'Software Engineering', 'Data base Management System'],
                'II': ['Discrete Mathematics', 'Operating Systems', 'Algorithm Design and Analysis', 'Computer Networks', 'Artificial Intelligence']
            }
        },
        EEE: {
            sections: ['EEE A2'],
            students: [64],
            subjects: {
                'I': ['Control Systems', 'Electrical Machines - I', 'Digital Electronics', 'Power Systems - I', 'Electrical Measurements and Sensors'],
                'II': ['Numerical Methods and Complex Variables', 'Electrical Machines - II', 'Power Systems - II', 'Power Electronics', 'Microprocessors and Microcontrollers']
            }
        }
    },
    3: {
        CSE: {
            sections: ['CSE A3', 'CSE B3', 'CSE C3'],
            students: [70, 70, 70],
            subjects: {
                'I': ['Automata Theory and Compiler Design', 'Artificial Intelligence', 'DevOps', 'Professional Elective-I', 'Open Elective-I'],
                'II': ['Cryptography and Networks Security', 'Deep Learning', 'Business Economics and Financial Analysis', 'Professional Elective-II', 'Open Elective-II']
            }
        },
        ECE: {
            sections: ['ECE A3', 'ECE B3'],
            students: [64, 64],
            subjects: {
                'I': ['Digital Signal Processing', 'RISC and Microcontroller architectures', 'CMOS VLSI Design', 'Professional Elective-I', 'Open Elective-I'],
                'II': ['Antenna Design and Wave Propagation', 'IoT Architectures and Protocols', 'Business Economics and Financial Analysis', 'Professional Elective-II', 'Open Elective-II']
            }
        },
        AIML: {
            sections: ['AIML A3', 'AIML B3'],
            students: [64, 64],
            subjects: {
                'I': ['Machine Learning', 'Automata Theory and Compiler Design', 'Data Analytics', 'Professional Elective-I', 'Open Elective-I'],
                'II': ['Natural Language Processing', 'Deep Learning', 'Business Economics and Financial Analysis', 'Professional Elective-II', 'Open Elective-II']
            }
        },
        EEE: {
            sections: ['EEE A3'],
            students: [64],
            subjects: {
                'I': ['Power Semiconductor Drives', 'Power System Protection', 'Power Electronics for Renewable Energy Systems', 'Professional Elective-I', 'Open Elective-I'],
                'II': ['Power System Operation and Control', 'Hybrid Electric Vehicles', 'Fundamentals of Management', 'Professional Elective-II', 'Open Elective-II']
            }
        }
    },
    4: {
        CSE: {
            sections: ['CSE A4', 'CSE B4', 'CSE C4'],
            students: [71, 70, 72],
            subjects: {
                'I': ['Natural Language Processing', 'Cyber Security', 'Fundamentals of Management', 'Professional Elective-III', 'Professional Elective-IV'],
                'II': ['Professional Elective-V', 'Professional Elective-VI']
            }
        },
        ECE: {
            sections: ['ECE A4', 'ECE B4'],
            students: [64, 64],
            subjects: {
                'I': ['Microwave and Optical Communications', 'Embedded System Design', 'Fundamentals of Management for Engineers', 'Professional Elective-III', 'Professional Elective-IV'],
                'II': ['Professional Elective-V', 'Professional Elective-VI']
            }
        },
        AIML: {
            sections: ['AIML A4', 'AIML B4'],
            students: [64, 64],
            subjects: {
                'I': ['Reinforcement Learning', 'Generative AI', 'Fundamentals of Management for Engineers', 'Professional Elective-III', 'Professional Elective-IV'],
                'II': ['Professional Elective-V', 'Professional Elective-VI']
            }
        },
        EEE: {
            sections: ['EEE A4'],
            students: [64],
            subjects: {
                'I': ['Smart Metering and Communication Protocols', 'EV Charging Infrastructure', 'Fundamentals of Management', 'Professional Elective-III', 'Professional Elective-IV'],
                'II': ['Professional Elective-V', 'Professional Elective-VI']
            }
        }
    }
};

function selectCommonSemester(semester) {
    selectedSemester = semester;
    document.getElementById('yearSelectionSection').style.display = 'block';
    updateYearBranchSelection();
}

function selectYear(year) {
    const btn = event.target;
    
    if (selectedYears.has(year)) {
        selectedYears.delete(year);
        btn.classList.remove('selected');
        delete yearBranchSelections[year];
    } else {
        selectedYears.add(year);
        btn.classList.add('selected');
        yearBranchSelections[year] = {};
    }
    
    updateYearBranchSelection();
}

function updateYearBranchSelection() {
    const container = document.getElementById('yearBranchSelection');
    container.innerHTML = '';
    
    if (selectedYears.size === 0) {
        document.getElementById('examDetailsSection').style.display = 'none';
        document.getElementById('examTimeSection').style.display = 'none';
        document.getElementById('generateSection').style.display = 'none';
        return;
    }
    
    Array.from(selectedYears).sort().forEach(year => {
        const yearDiv = document.createElement('div');
        yearDiv.className = 'form-group';
        yearDiv.style.background = '#f8f9fa';
        yearDiv.style.padding = '15px';
        yearDiv.style.borderRadius = '8px';
        yearDiv.style.marginBottom = '20px';
        
        yearDiv.innerHTML = `
            <h3 style="margin-top: 0; color: #1976d2;">Year ${year} - Semester ${selectedSemester} - Select Branches:</h3>
            <div class="branch-buttons" style="margin-bottom: 15px;">
                <button type="button" class="branch-btn" onclick="toggleYearBranch(${year}, 'CSE')">💻 CSE</button>
                <button type="button" class="branch-btn" onclick="toggleYearBranch(${year}, 'ECE')">📡 ECE</button>
                <button type="button" class="branch-btn" onclick="toggleYearBranch(${year}, 'AIML')">🤖 AIML</button>
                <button type="button" class="branch-btn" onclick="toggleYearBranch(${year}, 'EEE')">⚡ EEE</button>
            </div>
            <div id="subjects-year-${year}"></div>
        `;
        
        container.appendChild(yearDiv);
        
        if (yearBranchSelections[year]) {
            Object.keys(yearBranchSelections[year]).forEach(branch => {
                const btn = yearDiv.querySelector(`button[onclick="toggleYearBranch(${year}, '${branch}')"]`);
                if (btn) btn.classList.add('selected');
            });
            updateSubjectsForYear(year);
        }
    });
    
    checkIfReadyForExamDetails();
}

function toggleYearBranch(year, branch) {
    if (!yearBranchSelections[year]) {
        yearBranchSelections[year] = {};
    }
    
    const btn = event.target;
    
    if (yearBranchSelections[year][branch]) {
        delete yearBranchSelections[year][branch];
        btn.classList.remove('selected');
        delete selectedSubjects[`${year}-${branch}-${selectedSemester}`];
    } else {
        yearBranchSelections[year][branch] = selectedSemester;
        btn.classList.add('selected');
    }
    
    updateSubjectsForYear(year);
    checkIfReadyForExamDetails();
}

function updateSubjectsForYear(year) {
    const container = document.getElementById(`subjects-year-${year}`);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!yearBranchSelections[year] || Object.keys(yearBranchSelections[year]).length === 0) {
        return;
    }
    
    if (!selectedSemester) {
        container.innerHTML = '<p style="color: #dc3545; font-weight: 600;">⚠️ Please select a semester first</p>';
        return;
    }
    
    const currentBranchData = yearData[year];
    
    Object.keys(yearBranchSelections[year]).forEach(branch => {
        const div = document.createElement('div');
        div.style.marginTop = '10px';
        div.style.padding = '15px';
        div.style.background = 'white';
        div.style.borderRadius = '8px';
        
        const subjects = currentBranchData[branch].subjects[selectedSemester];
        
        div.innerHTML = `
            <label style="display: block; margin-bottom: 5px; font-weight: 600;">📖 ${branch} - Semester ${selectedSemester} - Select Subject:</label>
            <select id="subject-${year}-${branch}-${selectedSemester}" onchange="selectSubject('${year}-${branch}-${selectedSemester}', this.value)" 
                    style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px;">
                <option value="">Select Subject</option>
                ${subjects.map(subject => `
                    <option value="${subject}">${subject}</option>
                `).join('')}
            </select>
        `;
        container.appendChild(div);
    });
}

function selectSubject(key, subject) {
    selectedSubjects[key] = subject;
    checkIfReadyForExamDetails();
}

function checkIfReadyForExamDetails() {
    let allSubjectsSelected = true;
    let hasBranches = false;
    
    if (!selectedSemester) {
        document.getElementById('examDetailsSection').style.display = 'none';
        document.getElementById('examTimeSection').style.display = 'none';
        document.getElementById('generateSection').style.display = 'none';
        return;
    }
    
    selectedYears.forEach(year => {
        if (yearBranchSelections[year] && Object.keys(yearBranchSelections[year]).length > 0) {
            hasBranches = true;
            Object.keys(yearBranchSelections[year]).forEach(branch => {
                if (!selectedSubjects[`${year}-${branch}-${selectedSemester}`]) {
                    allSubjectsSelected = false;
                }
            });
        }
    });
    
    if (hasBranches && allSubjectsSelected) {
        document.getElementById('examDetailsSection').style.display = 'block';
        document.getElementById('examTimeSection').style.display = 'block';
        document.getElementById('generateSection').style.display = 'block';
    } else {
        document.getElementById('examDetailsSection').style.display = 'none';
        document.getElementById('examTimeSection').style.display = 'none';
        document.getElementById('generateSection').style.display = 'none';
    }
}

function generateArrangement() {
    const examDate = document.getElementById('examDate').value;
    const examTime = document.getElementById('examTime').value;
    
    if (!examDate || !examTime) {
        alert('⚠️ Please enter exam date and time');
        return;
    }
    
    const [year, month, day] = examDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    
    // Collect all students
    const students = [];
    selectedYears.forEach(selectedYear => {
        const currentBranchData = yearData[selectedYear];
        
        if (yearBranchSelections[selectedYear]) {
            Object.keys(yearBranchSelections[selectedYear]).forEach(branch => {
                const subject = selectedSubjects[`${selectedYear}-${branch}-${selectedSemester}`];
                
                currentBranchData[branch].sections.forEach((sectionName, idx) => {
                    const numStudents = currentBranchData[branch].students[idx];
                    
                    for (let j = 0; j < numStudents; j++) {
                        students.push({
                            rollNo: `Student-${selectedYear}-${branch}-${sectionName}-${j+1}`,
                            section: sectionName,
                            subject: subject
                        });
                    }
                });
            });
        }
    });
    
    // Save to Firebase
    console.log('Clearing old Firebase data...');
    
    if (typeof clearAllArrangements === 'undefined') {
        alert('Firebase not connected. Please check configuration.');
        return;
    }
    
    clearAllArrangements().then(() => {
        console.log('✅ Old data cleared');
        console.log('Saving new data to Firebase...');
        
        const savePromises = students.map((student, idx) => {
            return saveSeatingArrangement({
                rollNumber: `${idx+1}`.padStart(4, '0'),
                fullRollNo: student.rollNo,
                section: student.section,
                classroom: 'TBD',
                bench: Math.floor(idx / 2) + 1,
                partner: null,
                subject: student.subject,
                examDate: formattedDate,
                examTime: examTime
            });
        });
        
        return Promise.all(savePromises);
    }).then(() => {
        console.log('✅ Saved to Firebase successfully');
        alert('✅ Seating arrangement generated and saved!');
    }).catch(error => {
        console.error('❌ Firebase error:', error);
        alert('Error: ' + error.message);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const examDateInput = document.getElementById('examDate');
    const displayDate = document.getElementById('displayDate');
    
    examDateInput?.addEventListener('change', function() {
            checkRoomCalculation();
        if (this.value) {
            const [year, month, day] = this.value.split('-');
            displayDate.textContent = `Selected: ${day}/${month}/${year}`;
        }
    });
});

function calculateRoomRequirements() {
    let totalStudents = 0;
    
    selectedYears.forEach(year => {
        const currentBranchData = yearData[year];
        if (yearBranchSelections[year]) {
            Object.keys(yearBranchSelections[year]).forEach(branch => {
                const branchTotal = currentBranchData[branch].students.reduce((a, b) => a + b, 0);
                totalStudents += branchTotal;
            });
        }
    });
    
    const roomsRequired = Math.ceil(totalStudents / 56); // 28 benches × 2 students
    
    document.getElementById('roomRequirementText').innerHTML = `
        <p style="margin: 10px 0; font-size: 20px;"><strong>👥 Total Students:</strong> ${totalStudents}</p>
        <p style="margin: 10px 0; font-size: 20px;"><strong>🏫 Rooms Required:</strong> ${roomsRequired}</p>
    `;
    
    document.getElementById('roomRequirementSection').style.display = 'block';
    document.getElementById('generateSection').style.display = 'block';
}

function checkRoomCalculation() {
    const examDate = document.getElementById('examDate')?.value;
    const examTime = document.getElementById('examTime')?.value;
    
    if (examDate && examTime && selectedYears.size > 0) {
        calculateRoomRequirements();
    }
}

// Update event listeners
const examTimeInput = document.getElementById('examTime');
examTimeInput?.addEventListener('change', function() {
    checkRoomCalculation();
});
