let selectedSemester = '';
let selectedYears = new Set();
let yearData = {}; // {year: {mid: '', branches: Set(), subjects: {}}}
window.isSavingData = false;

const branchData = {
    CSE: {
        sections: ['CSE-A', 'CSE-B', 'CSE-C', 'CSE-D', 'CSE-E', 'CSE-F'],
        subjects: ['Matrices and calculus', 'Engineering Chemistry', 'Programming for Problem solving', 'English for Enhancement skills', 'Fundamentals of Electronic Engineering']
    },
    ECE: {
        sections: ['ECE-A', 'ECE-B'],
        subjects: ['Matrices and calculus', 'Advanced Engineering Physics', 'Programming for Problem solving', 'English for Enhancement skills', 'Introduction to Electrical Engineering', 'Engineering Drawing and Computer Aided Drafting']
    },
    AIML: {
        sections: ['AIML-A', 'AIML-B'],
        subjects: ['Matrices and calculus', 'Advanced Engineering Physics', 'Programming for Problem solving', 'Engineering Drawing and Computer Aided Drafting', 'Basic Electrical Engineering']
    },
    EEE: {
        sections: ['EEE-A'],
        subjects: ['Matrices and calculus', 'Advanced Engineering Physics', 'Programming for Problem solving', 'English for Enhancement skills', 'Electrical Circuits - 1', 'Engineering Drawing and Computer Aided Drafting']
    }
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
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `
            <label>📖 ${branch} - Subject:</label>
            <select onchange="selectSubject('${year}', '${branch}', this.value)" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px;">
                <option value="">Select Subject</option>
                ${branchData[branch].subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
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
