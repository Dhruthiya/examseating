let selectedSemester = '';
let selectedYears = new Set();
let yearData = {}; // {year: {mid: '', branches: Set(), subjects: {}}}
window.isSavingData = false;

// Import year data from app-years.js structure
const YEAR_SUBJECTS = {
    '1st Year': {
        CSE: { 'Semester 1': ['Matrices and Calculus', 'Engineering Chemistry', 'English for Skill Enhancement', 'Electronic Devices and Circuits', 'Programming for Problem Solving'],
                'Semester 2': ['Ordinary Differential Equations and Vector Calculus', 'Advanced Engineering Physics', 'Engineering Drawing and Computer Aided Drafting', 'Basic Electrical Engineering', 'Data Structures'] },
        ECE: { 'Semester 1': ['Matrices and Calculus', 'Programming for Problem Solving', 'English for Skill Enhancement', 'Advanced Engineering Physics', 'Engineering Drawing and Computer Aided Drafting'],
                'Semester 2': ['Ordinary Differential Equations and Vector Calculus', 'Engineering Chemistry', 'Network Analysis and Synthesis', 'Python Programming', 'Electronic Devices and Circuits'] },
        AIML: { 'Semester 1': ['Matrices and Calculus', 'Advanced Engineering Physics', 'Programming for Problem Solving', 'Engineering Drawing and Computer Aided Drafting', 'Basic Electrical Engineering'],
                'Semester 2': ['Ordinary Differential Equations and Vector Calculus', 'Engineering Chemistry', 'English for Skill Enhancement', 'Fundamentals of Electronics Engineering', 'Data Structures'] },
        EEE: { 'Semester 1': ['Matrices and Calculus', 'Engineering Chemistry', 'C and Data Structures', 'Analog Electronics', 'Electrical Circuits - I'],
                'Semester 2': ['Ordinary Differential Equations and Vector Calculus', 'Applied Physics', 'Electromagnetic fields', 'Computer Aided Engineering Graphics', 'Electrical Circuits - II'] }
    },
    '2nd Year': {
        CSE: { 'Semester 1': ['Discrete Mathematics', 'Computer Organization and Architecture', 'Object Oriented Programming through java', 'Software Engineering', 'Database Management Systems'],
                'Semester 2': ['Computer oriented Statistical Methods', 'Operating Systems', 'Algorithm design and Analysis', 'Computer Networks', 'Machine Learning'] },
        ECE: { 'Semester 1': ['Signals and Systems', 'Digital Logic Design', 'Control Systems', 'Data Structures', 'Numerical Methods and Complex Variables'],
                'Semester 2': ['Probability Theory and Stochastic Processes', 'Electromagnetic Fields and Transmission Lines', 'Analog and Digital Communications', 'Electronic Circuit Analysis', 'Linear and Digital IC Applications'] },
        AIML: { 'Semester 1': ['Mathematical and Statistical Foundations', 'Computer Organization and Architecture', 'Object Oriented Programming through Java', 'Software Engineering', 'Data base Management System'],
                'Semester 2': ['Discrete Mathematics', 'Operating Systems', 'Algorithm Design and Analysis', 'Computer Networks', 'Artificial Intelligence'] },
        EEE: { 'Semester 1': ['Control Systems', 'Electrical Machines - I', 'Digital Electronics', 'Power Systems - I', 'Electrical Measurements and Sensors'],
                'Semester 2': ['Numerical Methods and Complex Variables', 'Electrical Machines - II', 'Power Systems - II', 'Power Electronics', 'Microprocessors and Microcontrollers'] }
    },
    '3rd Year': {
        CSE: { 'Semester 1': ['Automata Theory and Compiler Design', 'Artificial Intelligence', 'DevOps', 'Professional Elective-I', 'Open Elective-I'],
                'Semester 2': ['Cryptography and Networks Security', 'Deep Learning', 'Business Economics and Financial Analysis', 'Professional Elective-II', 'Open Elective-II'] },
        ECE: { 'Semester 1': ['Digital Signal Processing', 'RISC and Microcontroller architectures', 'CMOS VLSI Design', 'Professional Elective-I', 'Open Elective-I'],
                'Semester 2': ['Antenna Design and Wave Propagation', 'IoT Architectures and Protocols', 'Business Economics and Financial Analysis', 'Professional Elective-II', 'Open Elective-II'] },
        AIML: { 'Semester 1': ['Machine Learning', 'Automata Theory and Compiler Design', 'Data Analytics', 'Professional Elective-I', 'Open Elective-I'],
                'Semester 2': ['Natural Language Processing', 'Deep Learning', 'Business Economics and Financial Analysis', 'Professional Elective-II', 'Open Elective-II'] },
        EEE: { 'Semester 1': ['Power Semiconductor Drives', 'Power System Protection', 'Power Electronics for Renewable Energy Systems', 'Professional Elective-I', 'Open Elective-I'],
                'Semester 2': ['Power System Operation and Control', 'Hybrid Electric Vehicles', 'Fundamentals of Management', 'Professional Elective-II', 'Open Elective-II'] }
    },
    '4th Year': {
        CSE: { 'Semester 1': ['Natural Language Processing', 'Cyber Security', 'Fundamentals of Management', 'Professional Elective-III', 'Professional Elective-IV'],
                'Semester 2': ['Professional Elective-V', 'Professional Elective-VI'] },
        ECE: { 'Semester 1': ['Microwave and Optical Communications', 'Embedded System Design', 'Fundamentals of Management for Engineers', 'Professional Elective-III', 'Professional Elective-IV'],
                'Semester 2': ['Professional Elective-V', 'Professional Elective-VI'] },
        AIML: { 'Semester 1': ['Reinforcement Learning', 'Generative AI', 'Fundamentals of Management for Engineers', 'Professional Elective-III', 'Professional Elective-IV'],
                'Semester 2': ['Professional Elective-V', 'Professional Elective-VI'] },
        EEE: { 'Semester 1': ['Smart Metering and Communication Protocols', 'EV Charging Infrastructure', 'Fundamentals of Management', 'Professional Elective-III', 'Professional Elective-IV'],
                'Semester 2': ['Professional Elective-V', 'Professional Elective-VI'] }
    }
};

const branchData = {
    CSE: { sections: ['CSE-A', 'CSE-B', 'CSE-C', 'CSE-D', 'CSE-E', 'CSE-F'] },
    ECE: { sections: ['ECE-A', 'ECE-B'] },
    AIML: { sections: ['AIML-A', 'AIML-B'] },
    EEE: { sections: ['EEE-A'] }
};

function selectSemester(semester) {
    selectedSemester = semester;
    document.querySelectorAll('.count-btn').forEach(btn => {
        if (btn.textContent === semester) btn.classList.add('selected');
    });
    document.getElementById('yearSelectionSection').style.display = 'block';
}

function toggleYear(year) {
    const btn = event.target;
    
    if (selectedYears.has(year)) {
        selectedYears.delete(year);
        btn.classList.remove('selected');
        delete yearData[year];
        document.getElementById(`year-block-${year.replace(/\s/g, '-')}`).remove();
    } else {
        selectedYears.add(year);
        btn.classList.add('selected');
        yearData[year] = { mid: '', branches: new Set(), subjects: {} };
        createYearBlock(year);
    }
    
    checkReady();
}

function createYearBlock(year) {
    const container = document.getElementById('yearDetailsContainer');
    const blockId = `year-block-${year.replace(/\s/g, '-')}`;
    
    const block = document.createElement('div');
    block.className = 'year-block';
    block.id = blockId;
    block.innerHTML = `
        <h3>${year}</h3>
        
        <div class="form-group">
            <label>📝 Select Exam Type:</label>
            <div class="branch-count-buttons">
                <button type="button" class="count-btn" onclick="selectMid('${year}', 'Mid 1')">Mid 1</button>
                <button type="button" class="count-btn" onclick="selectMid('${year}', 'Mid 2')">Mid 2</button>
                <button type="button" class="count-btn" onclick="selectMid('${year}', 'Sem')">Sem</button>
            </div>
        </div>
        
        <div class="form-group" id="branches-${year.replace(/\s/g, '-')}" style="display: none;">
            <label>🎯 Select Branches:</label>
            <div class="branch-buttons">
                <button type="button" class="branch-btn" onclick="toggleBranch('${year}', 'CSE')">💻 CSE</button>
                <button type="button" class="branch-btn" onclick="toggleBranch('${year}', 'ECE')">📡 ECE</button>
                <button type="button" class="branch-btn" onclick="toggleBranch('${year}', 'AIML')">🤖 AIML</button>
                <button type="button" class="branch-btn" onclick="toggleBranch('${year}', 'EEE')">⚡ EEE</button>
            </div>
        </div>
        
        <div id="subjects-${year.replace(/\s/g, '-')}"></div>
    `;
    
    container.appendChild(block);
}

function selectMid(year, mid) {
    yearData[year].mid = mid;
    const block = document.getElementById(`year-block-${year.replace(/\s/g, '-')}`);
    block.querySelectorAll('.count-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.textContent === mid) btn.classList.add('selected');
    });
    
    document.getElementById(`branches-${year.replace(/\s/g, '-')}`).style.display = 'block';
    checkReady();
}

function toggleBranch(year, branch) {
    const btn = event.target;
    
    if (yearData[year].branches.has(branch)) {
        yearData[year].branches.delete(branch);
        btn.classList.remove('selected');
        delete yearData[year].subjects[branch];
    } else {
        yearData[year].branches.add(branch);
        btn.classList.add('selected');
    }
    
    updateSubjects(year);
    checkReady();
}

function updateSubjects(year) {
    const container = document.getElementById(`subjects-${year.replace(/\s/g, '-')}`);
    container.innerHTML = '';
    
    yearData[year].branches.forEach(branch => {
        const subjects = YEAR_SUBJECTS[year][branch][selectedSemester] || [];
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `
            <label>📖 ${branch} - Subject:</label>
            <select onchange="selectSubject('${year}', '${branch}', this.value)" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px;">
                <option value="">Select Subject</option>
                ${subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
        `;
        container.appendChild(div);
    });
    
    if (yearData[year].branches.size > 0) {
        document.getElementById('examDetailsSection').style.display = 'block';
        document.getElementById('examTimeSection').style.display = 'block';
    }
}

function selectSubject(year, branch, subject) {
    yearData[year].subjects[branch] = subject;
    checkReady();
}

function checkReady() {
    const examDate = document.getElementById('examDate')?.value;
    const examTime = document.getElementById('examTime')?.value;
    
    let allReady = selectedSemester && selectedYears.size > 0 && examDate && examTime;
    
    if (allReady) {
        for (let year of selectedYears) {
            const data = yearData[year];
            if (!data.mid || data.branches.size === 0) {
                allReady = false;
                break;
            }
            for (let branch of data.branches) {
                if (!data.subjects[branch]) {
                    allReady = false;
                    break;
                }
            }
        }
    }
    
    document.getElementById('generateButtonSection').style.display = allReady ? 'block' : 'none';
}

function generateMultiYearArrangement() {
    console.log('Generating multi-year arrangement...');
    console.log('Semester:', selectedSemester);
    console.log('Years:', Array.from(selectedYears));
    console.log('Year Data:', yearData);
    
    const examDate = document.getElementById('examDate').value;
    const examTime = document.getElementById('examTime').value;
    
    // Collect all students from all years
    const allStudents = [];
    const allSections = [];
    
    selectedYears.forEach(year => {
        const data = yearData[year];
        data.branches.forEach(branch => {
            const subject = data.subjects[branch];
            branchData[branch].sections.forEach(sectionName => {
                const fullSectionName = `${year} ${sectionName}`;
                const rollNumbers = ROLL_NUMBERS[fullSectionName] || [];
                
                if (rollNumbers.length > 0) {
                    allSections.push({ name: sectionName, subject: subject, year: year, mid: data.mid });
                    rollNumbers.forEach(rollNo => {
                        allStudents.push({
                            rollNo: rollNo,
                            name: rollNo,
                            section: sectionName,
                            subject: subject,
                            year: year,
                            mid: data.mid
                        });
                    });
                }
            });
        });
    });
    
    console.log('Total students:', allStudents.length);
    
    // Use existing allocation logic
    const result = allocateSeatsToClassrooms(allStudents, allSections);
    
    // Store metadata
    const tableMetadata = {
        semester: selectedSemester,
        years: Array.from(selectedYears),
        yearData: JSON.parse(JSON.stringify(yearData, (key, value) => value instanceof Set ? Array.from(value) : value)),
        examDate: examDate,
        examTime: examTime,
        examDateISO: document.getElementById('examDate').value
    };
    
    sessionStorage.setItem('seatingData', JSON.stringify(result.seated));
    sessionStorage.setItem('overflowData', JSON.stringify(result.overflow));
    sessionStorage.setItem('tableMetadata', JSON.stringify(tableMetadata));
    
    window.location.href = 'results.html';
}

function allocateSeatsToClassrooms(students, sections) {
    const BENCHES_PER_CLASSROOM = 28;
    const seated = [];
    const overflow = [];
    
    let currentRoom = 301;
    let currentBench = 1;
    
    for (let i = 0; i < students.length; i += 2) {
        const student1 = students[i];
        const student2 = students[i + 1] || null;
        
        if (currentBench > BENCHES_PER_CLASSROOM) {
            currentRoom++;
            currentBench = 1;
        }
        
        seated.push({
            classroom: currentRoom,
            bench: currentBench,
            seat1: student1,
            seat2: student2
        });
        
        currentBench++;
    }
    
    return { seated, overflow };
}

// Load all tables function
async function loadAllTables() {
    const container = document.getElementById('tablesContainer');
    container.innerHTML = '<p>Loading...</p>';
    
    try {
        const snapshot = await db.collection('examTables').get();
        container.innerHTML = '';
        
        if (snapshot.empty) {
            container.innerHTML = '<p>No tables found.</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const table = doc.data();
            const card = document.createElement('div');
            card.style.cssText = 'background: white; padding: 20px; margin: 10px 0; border-radius: 8px; border: 2px solid #e0e0e0;';
            card.innerHTML = `
                <h3>${table.tableName || 'Unnamed Table'}</h3>
                <p><strong>Semester:</strong> ${table.semester}</p>
                <p><strong>Years:</strong> ${table.years.join(', ')}</p>
                <p><strong>Date:</strong> ${table.examDate} | <strong>Time:</strong> ${table.examTime}</p>
                <button onclick="deleteTable('${doc.id}')" style="background: #dc3545; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading tables:', error);
        container.innerHTML = '<p style="color: red;">Error loading tables</p>';
    }
}

async function deleteTable(id) {
    if (!confirm('Delete this table?')) return;
    try {
        await db.collection('examTables').doc(id).delete();
        loadAllTables();
    } catch (error) {
        alert('Error deleting: ' + error.message);
    }
}
