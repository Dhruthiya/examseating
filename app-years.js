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
    
    if (selectedRooms.size === 0) {
        alert('⚠️ Please select rooms first');
        return;
    }
    
    const [year, month, day] = examDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    
    // Collect all students with proper roll numbers
    const students = [];
    selectedYears.forEach(selectedYear => {
        const currentBranchData = yearData[selectedYear];
        
        if (yearBranchSelections[selectedYear]) {
            Object.keys(yearBranchSelections[selectedYear]).forEach(branch => {
                const subject = selectedSubjects[`${selectedYear}-${branch}-${selectedSemester}`];
                const rollNumbers = generateRollNumbers(branch, selectedYear);
                
                currentBranchData[branch].sections.forEach((sectionName, idx) => {
                    const numStudents = currentBranchData[branch].students[idx];
                    const startIdx = currentBranchData[branch].sections.slice(0, idx).reduce((sum, _, i) => sum + currentBranchData[branch].students[i], 0);
                    
                    for (let j = 0; j < numStudents; j++) {
                        students.push({
                            rollNo: rollNumbers[startIdx + j],
                            section: sectionName,
                            subject: subject
                        });
                    }
                });
            });
        }
    });
    
    // Allocate seats
    const rooms = Array.from(selectedRooms);
    const sections = rooms.map(room => ({ name: room }));
    const seatingResult = [];
    let studentIndex = 0;
    
    rooms.forEach(room => {
        for (let bench = 1; bench <= 28; bench++) {
            const seat1 = students[studentIndex++];
            const seat2 = students[studentIndex++];
            
            if (seat1) {
                seatingResult.push({
                    classroom: room,
                    bench: bench,
                    seat1: seat1,
                    seat2: seat2 || null
                });
            }
        }
    });
    
    // Save to sessionStorage for results page
    sessionStorage.setItem('seatingData', JSON.stringify(seatingResult));
    sessionStorage.setItem('sections', JSON.stringify(sections));
    sessionStorage.setItem('overflowData', JSON.stringify([]));
    sessionStorage.setItem('examDate', formattedDate);
    sessionStorage.setItem('examTime', examTime);
    
    // Save to Firebase
    console.log('Clearing old Firebase data...');
    
    if (typeof clearAllArrangements === 'undefined') {
        alert('Firebase not connected. Redirecting to results...');
        window.location.href = 'results.html';
        return;
    }
    
    clearAllArrangements().then(() => {
        console.log('✅ Old data cleared');
        console.log('Saving new data to Firebase...');
        
        const savePromises = seatingResult.map(seat => {
            if (seat.seat1) {
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
                    examDate: formattedDate,
                    examTime: examTime
                });
            }
        });
        
        return Promise.all(savePromises);
    }).then(() => {
        console.log('✅ Saved to Firebase successfully');
        window.location.href = 'results.html';
    }).catch(error => {
        console.error('❌ Firebase error:', error);
        alert('Data saved locally. Redirecting to results...');
        window.location.href = 'results.html';
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
    
    displayRoomAssignmentOptions(roomsRequired);
    document.getElementById('roomRequirementSection').style.display = 'block';
}

function displayRoomAssignmentOptions(roomsRequired) {
    const container = document.getElementById('roomAssignmentDisplay');
    container.innerHTML = `
        <div id="assignmentButtons" style="margin-top: 20px;">
            <h4 style="margin-bottom: 15px;">🎯 Choose Assignment Method:</h4>
            <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                <button onclick="startAutoAssign(${roomsRequired})" style="flex: 1; padding: 15px; background: #4caf50; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600;">
                    ✨ Auto Assign
                </button>
                <button onclick="startManualAssign(${roomsRequired})" style="flex: 1; padding: 15px; background: #ff9800; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600;">
                    ✋ Manual Assign
                </button>
            </div>
        </div>
        <div id="roomSelectionDisplay"></div>
    `;
}

const selectedRooms = new Set();

function getAllAvailableRooms() {
    const rooms = [];
    const branches = ['CSE', 'ECE', 'AIML', 'EEE'];
    const sections = {
        'CSE': ['A', 'B', 'C', 'D', 'E', 'F'],
        'ECE': ['A', 'B'],
        'AIML': ['A', 'B'],
        'EEE': ['A']
    };
    
    // Add all section classrooms (all 4 years, all branches)
    for (let year = 1; year <= 4; year++) {
        branches.forEach(branch => {
            sections[branch].forEach(section => {
                rooms.push(`${branch} ${section}${year}`);
            });
        });
    }
    
    // Add additional rooms
    rooms.push('BSFI-1', 'BSFI-2', 'SMB (Seminar Hall-1)', 'SMB (Seminar Hall-2)', 'SMB (Seminar Hall-3)', 'SMB (Seminar Hall-4)');
    
    return rooms;
}

function startAutoAssign(roomsRequired) {
    // Get section rooms from selected years/branches
    const sectionRooms = [];
    selectedYears.forEach(year => {
        const currentBranchData = yearData[year];
        if (yearBranchSelections[year]) {
            Object.keys(yearBranchSelections[year]).forEach(branch => {
                currentBranchData[branch].sections.forEach(section => {
                    sectionRooms.push(section);
                });
            });
        }
    });
    
    selectedRooms.clear();
    sectionRooms.forEach(room => selectedRooms.add(room));
    
    const sectionRoomCapacity = sectionRooms.length * 56; // 28 benches × 2 students
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
    
    const additionalStudents = Math.max(0, totalStudents - sectionRoomCapacity);
    const additionalRoomsNeeded = Math.ceil(additionalStudents / 56);
    
    const container = document.getElementById('roomSelectionDisplay');
    container.innerHTML = `
        <h4 style="margin-top: 20px; color: #4caf50;">✨ Auto Assign - Section Rooms:</h4>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <p style="margin: 5px 0;"><strong>🏫 Section Rooms Auto-Allocated:</strong> ${sectionRooms.length} rooms</p>
            <p style="margin: 5px 0;"><strong>👥 Capacity:</strong> ${sectionRoomCapacity} students</p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                ${sectionRooms.map(room => `<span style="padding: 5px 10px; background: white; border-radius: 4px; border: 2px solid #4caf50;">${room}</span>`).join('')}
            </div>
        </div>
    `;
    
    if (additionalRoomsNeeded > 0) {
        container.innerHTML += `
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 10px 0; border: 2px solid #ffc107;">
                <p style="margin: 5px 0; color: #856404;"><strong>⚠️ Additional Rooms Needed:</strong> ${additionalRoomsNeeded} rooms</p>
                <p style="margin: 5px 0; color: #856404;"><strong>👥 Remaining Students:</strong> ${additionalStudents} students</p>
                <button onclick="selectAdditionalRooms(${additionalRoomsNeeded})" style="width: 100%; padding: 12px; background: #ff9800; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; margin-top: 10px;">
                    📍 Select ${additionalRoomsNeeded} Additional Room(s)
                </button>
            </div>
        `;
    } else {
        document.getElementById('generateSection').style.display = 'block';
    }
}

function selectAdditionalRooms(needed) {
    const allRooms = getAllAvailableRooms();
    const usedRooms = Array.from(selectedRooms);
    const availableRooms = allRooms.filter(room => !usedRooms.includes(room));
    
    const modal = document.getElementById('roomSelectionModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalRoomList = document.getElementById('modalRoomList');
    
    modalTitle.textContent = `Select ${needed} Additional Room(s)`;
    
    const tempSelected = new Set();
    
    modalRoomList.innerHTML = `
        <div id="selectionCounter" style="background: #e3f2fd; padding: 12px; border-radius: 8px; margin-bottom: 15px; text-align: center; font-weight: 600; font-size: 16px; color: #1565c0;">
            Selected: 0 / ${needed} rooms
        </div>
        <div id="additionalRoomGrid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; padding: 15px; margin-bottom: 20px; background: #fafafa; border-radius: 8px; max-height: 400px; overflow-y: auto;"></div>
        <button onclick="confirmAdditionalRooms()" style="width: 100%; padding: 16px; background: #4caf50; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 17px; margin-bottom: 10px;">
            ✅ Confirm Selection
        </button>
        <button onclick="closeRoomModal()" style="width: 100%; padding: 16px; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 17px;">
            ❌ Close
        </button>
    `;
    
    const gridDiv = document.getElementById('additionalRoomGrid');
    
    availableRooms.forEach(room => {
        const btn = document.createElement('button');
        btn.textContent = room;
        btn.style.cssText = 'padding: 12px 8px; border: 2px solid #e0e0e0; background: white; color: #333; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 12px; min-height: 50px;';
        
        btn.onclick = () => {
            if (tempSelected.has(room)) {
                tempSelected.delete(room);
                btn.style.background = 'white';
                btn.style.borderColor = '#e0e0e0';
            } else {
                if (tempSelected.size < needed) {
                    tempSelected.add(room);
                    btn.style.background = '#4a90e2';
                    btn.style.color = 'white';
                    btn.style.borderColor = '#4a90e2';
                } else {
                    alert(`⚠️ You can only select ${needed} room(s)`);
                }
            }
            
            document.getElementById('selectionCounter').textContent = `Selected: ${tempSelected.size} / ${needed} rooms`;
        };
        
        gridDiv.appendChild(btn);
    });
    
    window.tempSelectedRooms = tempSelected;
    window.neededRooms = needed;
    modal.style.display = 'block';
}

function confirmAdditionalRooms() {
    if (window.tempSelectedRooms.size === window.neededRooms) {
        window.tempSelectedRooms.forEach(room => selectedRooms.add(room));
        
        const container = document.getElementById('roomSelectionDisplay');
        container.innerHTML += `
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <h4 style="margin-top: 0; color: #1976d2;">➕ Additional Rooms Selected:</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${Array.from(window.tempSelectedRooms).map(room => `<span style="padding: 5px 10px; background: white; border-radius: 4px; border: 2px solid #2196f3;">${room}</span>`).join('')}
                </div>
            </div>
        `;
        
        closeRoomModal();
        document.getElementById('generateSection').style.display = 'block';
    } else {
        alert(`⚠️ Please select exactly ${window.neededRooms} room(s)`);
    }
}

function closeRoomModal() {
    document.getElementById('roomSelectionModal').style.display = 'none';
}

function startManualAssign(roomsRequired) {
    const allRooms = getAllAvailableRooms();
    selectedRooms.clear();
    
    const container = document.getElementById('roomSelectionDisplay');
    container.innerHTML = `
        <h4 style="margin-top: 20px; color: #ff9800; font-size: 20px;">✋ Manual Assign - Select ${roomsRequired} Room(s):</h4>
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 10px 0; border: 2px solid #ffc107;">
            <p id="manualCounter" style="margin: 0; color: #856404; font-weight: 600; font-size: 16px;">Selected: 0 / ${roomsRequired} rooms</p>
        </div>
        <div id="roomGrid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; max-height: 450px; overflow-y: auto; padding: 15px; margin: 15px 0; background: #fafafa; border-radius: 8px; border: 1px solid #e0e0e0;"></div>
    `;
    
    const gridDiv = document.getElementById('roomGrid');
    
    allRooms.forEach(room => {
        const btn = document.createElement('button');
        btn.textContent = room;
        btn.style.cssText = 'padding: 15px 10px; border: 2px solid #e0e0e0; background: white; color: #333; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; transition: all 0.2s; min-height: 55px;';
        
        btn.onclick = () => {
            if (selectedRooms.has(room)) {
                selectedRooms.delete(room);
                btn.style.background = 'white';
                btn.style.color = '#333';
                btn.style.borderColor = '#e0e0e0';
            } else {
                if (selectedRooms.size < roomsRequired) {
                    selectedRooms.add(room);
                    btn.style.background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
                    btn.style.color = 'white';
                    btn.style.borderColor = '#ff9800';
                } else {
                    alert(`⚠️ You can only select ${roomsRequired} room(s)`);
                }
            }
            
            const counter = document.getElementById('manualCounter');
            counter.textContent = `Selected: ${selectedRooms.size} / ${roomsRequired} rooms`;
            counter.parentElement.style.background = selectedRooms.size === roomsRequired ? '#c8e6c9' : '#fff3cd';
            counter.parentElement.style.borderColor = selectedRooms.size === roomsRequired ? '#4caf50' : '#ffc107';
            counter.style.color = selectedRooms.size === roomsRequired ? '#2e7d32' : '#856404';
            
            if (selectedRooms.size === roomsRequired) {
                document.getElementById('generateSection').style.display = 'block';
            } else {
                document.getElementById('generateSection').style.display = 'none';
            }
        };
        
        gridDiv.appendChild(btn);
    });
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

function generateRollNumbers(branch, year) {
    const rolls = [];
    const yearCode = year === 1 ? '25' : year === 2 ? '24' : year === 3 ? '23' : '22';
    const lateralYearCode = year === 2 ? '25' : year === 3 ? '24' : year === 4 ? '23' : null;
    const branchCodes = { CSE: '05', ECE: '55', AIML: '66', EEE: '44' };
    const code = branchCodes[branch];
    
    if (branch === 'CSE' && year === 1) {
        // Year 1 CSE: 385 students (no laterals)
        for (let i = 1; i <= 64; i++) {
            rolls.push(`${yearCode}wh1a${code}${i.toString().padStart(2, '0')}`);
        }
        for (let i = 65; i <= 99; i++) {
            rolls.push(`${yearCode}wh1a${code}${i}`);
        }
        'abc'.split('').forEach(letter => {
            const end = letter === 'c' ? 8 : 9;
            for (let i = 0; i <= end; i++) {
                rolls.push(`${yearCode}wh1a${code}${letter}${i}`);
            }
        });
        rolls.push(`${yearCode}wh1a${code}c9`);
        'defghj'.split('').forEach(letter => {
            for (let i = 0; i <= 9; i++) {
                rolls.push(`${yearCode}wh1a${code}${letter}${i}`);
            }
        });
        for (let i = 0; i <= 3; i++) {
            rolls.push(`${yearCode}wh1a${code}k${i}`);
        }
        for (let i = 4; i <= 9; i++) {
            rolls.push(`${yearCode}wh1a${code}k${i}`);
        }
        'lmnpqr'.split('').forEach(letter => {
            const end = letter === 'r' ? 7 : 9;
            for (let i = 0; i <= end; i++) {
                rolls.push(`${yearCode}wh1a${code}${letter}${i}`);
            }
        });
        for (let i = 8; i <= 9; i++) {
            rolls.push(`${yearCode}wh1a${code}r${i}`);
        }
        'tuvwxyz'.split('').forEach(letter => {
            const end = letter === 'z' ? 1 : 9;
            for (let i = 0; i <= end; i++) {
                rolls.push(`${yearCode}wh1a${code}${letter}${i}`);
            }
        });
        for (let i = 2; i <= 9; i++) {
            rolls.push(`${yearCode}wh1a${code}z${i}`);
        }
        const letters = 'abcdefghjklmnpqrtuvwxyz'.split('');
        for (let i = 0; i < letters.length; i++) {
            for (let j = 0; j < letters.length; j++) {
                const combo = letters[i] + letters[j];
                if (combo === 'ci') rolls.push(`${yearCode}wh1a${code}ci`);
                else if (!combo.includes('i') && !combo.includes('o') && !combo.includes('s')) {
                    rolls.push(`${yearCode}wh1a${code}${combo}`);
                }
                if (combo === 'cj' || (letters[i] === 'c' && letters[j] === 'j')) break;
            }
            if (letters[i] === 'c') break;
        }
    } else if (branch === 'CSE' && year === 2) {
        // Year 2 CSE: 424 students (6 sections with laterals)
        // Section A: 01-64 + lateral 01-07
        for (let i = 1; i <= 64; i++) {
            rolls.push(`${yearCode}wh1a${code}${i.toString().padStart(2, '0')}`);
        }
        for (let i = 1; i <= 7; i++) {
            rolls.push(`${lateralYearCode}wh5a${code}${i.toString().padStart(2, '0')}`);
        }
        // Section B: 65-99, a0-c8 + lateral 08-14
        for (let i = 65; i <= 99; i++) {
            rolls.push(`${yearCode}wh1a${code}${i}`);
        }
        'abc'.split('').forEach(letter => {
            const end = letter === 'c' ? 8 : 9;
            for (let i = 0; i <= end; i++) {
                rolls.push(`${yearCode}wh1a${code}${letter}${i}`);
            }
        });
        for (let i = 8; i <= 14; i++) {
            rolls.push(`${lateralYearCode}wh5a${code}${i.toString().padStart(2, '0')}`);
        }
        // Continue for other sections...
        // Section C-F similar pattern
        for (let i = 15; i <= 41; i++) {
            rolls.push(`${lateralYearCode}wh5a${code}${i.toString().padStart(2, '0')}`);
        }
    } else if (branch === 'CSE' && year === 3) {
        // Year 3 CSE: 210 students (3 sections)
        for (let i = 1; i <= 64; i++) {
            rolls.push(`${yearCode}wh1a${code}${i.toString().padStart(2, '0')}`);
        }
        for (let i = 1; i <= 6; i++) {
            rolls.push(`${lateralYearCode}wh5a${code}${i.toString().padStart(2, '0')}`);
        }
        for (let i = 65; i <= 99; i++) {
            rolls.push(`${yearCode}wh1a${code}${i}`);
        }
        'abc'.split('').forEach(letter => {
            const end = letter === 'c' ? 8 : 9;
            for (let i = 0; i <= end; i++) {
                rolls.push(`${yearCode}wh1a${code}${letter}${i}`);
            }
        });
        for (let i = 7; i <= 19; i++) {
            rolls.push(`${lateralYearCode}wh5a${code}${i.toString().padStart(2, '0')}`);
        }
    } else if (branch === 'CSE' && year === 4) {
        // Year 4 CSE: 213 students (3 sections)
        for (let i = 1; i <= 65; i++) {
            rolls.push(`${yearCode}wh1a${code}${i.toString().padStart(2, '0')}`);
        }
        for (let i = 1; i <= 6; i++) {
            rolls.push(`${lateralYearCode}wh5a${code}${i.toString().padStart(2, '0')}`);
        }
        for (let i = 66; i <= 99; i++) {
            rolls.push(`${yearCode}wh1a${code}${i}`);
        }
        'abc'.split('').forEach(letter => {
            for (let i = 0; i <= 9; i++) {
                rolls.push(`${yearCode}wh1a${code}${letter}${i}`);
            }
        });
        for (let i = 7; i <= 19; i++) {
            rolls.push(`${lateralYearCode}wh5a${code}${i.toString().padStart(2, '0')}`);
        }
        rolls.push('24wh8a0501'); // Special student
    } else if (branch === 'ECE' || branch === 'AIML') {
        // ECE/AIML: 128 students (2 sections)
        for (let i = 1; i <= 64; i++) {
            rolls.push(`${yearCode}wh1a${code}${i.toString().padStart(2, '0')}`);
        }
        for (let i = 65; i <= 99; i++) {
            rolls.push(`${yearCode}wh1a${code}${i}`);
        }
        'abc'.split('').forEach(letter => {
            const end = letter === 'c' ? 8 : 9;
            for (let i = 0; i <= end; i++) {
                rolls.push(`${yearCode}wh1a${code}${letter}${i}`);
            }
        });
    } else if (branch === 'EEE') {
        // EEE: 64 students (1 section)
        for (let i = 1; i <= 64; i++) {
            rolls.push(`${yearCode}wh1a${code}${i.toString().padStart(2, '0')}`);
        }
    }
    
    return rolls;
}
