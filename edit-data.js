/**
 * edit-data.js
 * Handles the "Edit Option" view in the Admin Panel.
 * Responsibilities:
 *  - Render the student data editing UI
 *  - Parse uploaded Excel (.xlsx/.xls) or CSV files via SheetJS (already loaded in admin.html)
 *  - Detect year / branch / section from the parsed data
 *  - Let admin drill down: Year → Branch → Section → Roll Number table
 */

// ─── State ────────────────────────────────────────────────────────────────────
let editParsedData = [];   // flat array of { sno, rollNo, name, year, branch, section }

function sortEditStudentRecords(students) {
    return [...students].sort((a, b) =>
        String(a.year).localeCompare(String(b.year)) ||
        String(a.branch).localeCompare(String(b.branch)) ||
        String(a.section).localeCompare(String(b.section)) ||
        String(a.rollNo).localeCompare(String(b.rollNo), undefined, { numeric: true, sensitivity: 'base' })
    );
}

// ─── Entry point called by showView('edit') ───────────────────────────────────
async function initEditView() {
    const container = document.getElementById('editView');
    container.innerHTML = `
        <h1 style="margin-bottom:6px;">✏️ Edit Student Data</h1>
        <p style="color:#6b7280;margin-bottom:28px;font-size:14px;">
            Upload an Excel or CSV file, then edit student names or hall-ticket numbers before saving.
        </p>

        <!-- Upload Card -->
        <div class="edit-card" id="uploadCard">
            <h3 style="margin:0 0 18px 0;color:#374151;">📂 Upload Excel / CSV File</h3>
            <div class="edit-upload-area" id="editUploadArea" onclick="document.getElementById('editFileInput').click()">
                <div style="font-size:40px;margin-bottom:10px;">📤</div>
                <p style="margin:0;font-weight:600;color:#374151;">Click to browse or drag &amp; drop</p>
                <p style="margin:6px 0 0;font-size:13px;color:#9ca3af;">Accepted: .csv, .xlsx, .xls</p>
            </div>
            <input type="file" id="editFileInput" accept=".csv,.xlsx,.xls"
                   style="display:none;" onchange="handleEditFile(event)">
            <div id="editFileStatus" style="margin-top:14px;font-size:13px;color:#6b7280;"></div>
            <button id="saveAllStudentDataButton" type="button" class="sidebar-btn"
                    style="display:none;margin-top:16px;background:#15803d;color:white;"
                    onclick="saveAllEditDataToSystem()">💾 Save All and Replace Student Data</button>
            <button id="generateFromUploadButton" type="button" class="sidebar-btn"
                    style="display:none;margin-top:10px;background:#4a90e2;color:white;"
                    onclick="saveRosterAndOpenGenerator()">🎓 Generate Table</button>
        </div>

        <!-- Year Selection (shown after upload) -->
        <div class="edit-card" id="yearCard" style="display:none;">
            <h3 style="margin:0 0 18px 0;color:#374151;">📅 Select Year</h3>
            <div id="yearButtons" class="edit-btn-row"></div>
        </div>

        <!-- Branch Selection -->
        <div class="edit-card" id="branchCard" style="display:none;">
            <h3 style="margin:0 0 6px 0;color:#374151;">🏫 Select Branch</h3>
            <p id="branchCardSub" style="font-size:13px;color:#6b7280;margin:0 0 16px 0;"></p>
            <div id="branchButtons" class="edit-btn-row"></div>
        </div>

        <!-- Section Selection -->
        <div class="edit-card" id="sectionCard" style="display:none;">
            <h3 style="margin:0 0 6px 0;color:#374151;">📋 Select Section</h3>
            <p id="sectionCardSub" style="font-size:13px;color:#6b7280;margin:0 0 16px 0;"></p>
            <div id="sectionButtons" class="edit-btn-row"></div>
        </div>

        <!-- Roll Number Table -->
        <div class="edit-card" id="tableCard" style="display:none;">
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:18px;">
                <div>
                    <h3 style="margin:0;color:#374151;" id="tableCardTitle">👥 Student Roll Numbers</h3>
                    <p id="tableCardSub" style="font-size:13px;color:#6b7280;margin:4px 0 0 0;"></p>
                </div>
                <button class="sidebar-btn" style="margin:0;background:#4a90e2;color:white;"
                        onclick="saveEditDataToRollNumbers()">💾 Save Changes</button>
            </div>
            <div id="editTableWrapper" style="overflow-x:auto;"></div>
        </div>
    `;

    // Inject styles once
    injectEditStyles();

    // Wire up drag-and-drop
    const dropArea = document.getElementById('editUploadArea');
    dropArea.addEventListener('dragover', e => { e.preventDefault(); dropArea.classList.add('dragover'); });
    dropArea.addEventListener('dragleave', () => dropArea.classList.remove('dragover'));
    dropArea.addEventListener('drop', e => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) processEditFile(file);
    });

    try {
        const snapshot = await db.collection('studentSections').get();
        const records = snapshot.docs.map(doc => doc.data());
        if (records.length) {
            editParsedData = sortEditStudentRecords(records.flatMap(record => (record.students || []).map((student, index) => ({
                sno: index + 1,
                rollNo: student.rollNo,
                name: student.name || '',
                year: record.year,
                branch: record.branch,
                section: record.section
            }))));
            setEditStatus(`Loaded ${editParsedData.length} saved student records. Select a year to edit.`, 'green');
            renderYearSelection();
        }
    } catch (error) {
        setEditStatus(`Could not load saved records: ${error.message}`, 'red');
    }
}

// ─── Inject CSS (only once) ───────────────────────────────────────────────────
function injectEditStyles() {
    if (document.getElementById('editDataStyles')) return;
    const style = document.createElement('style');
    style.id = 'editDataStyles';
    style.textContent = `
        .edit-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 24px;
            margin-bottom: 20px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .edit-upload-area {
            border: 2px dashed #cbd5e0;
            border-radius: 10px;
            padding: 36px 20px;
            text-align: center;
            cursor: pointer;
            transition: border-color 0.2s, background 0.2s;
        }
        .edit-upload-area:hover, .edit-upload-area.dragover {
            border-color: #4a90e2;
            background: #eff6ff;
        }
        .edit-btn-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .edit-year-btn, .edit-branch-btn, .edit-section-btn {
            padding: 10px 22px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            background: white;
            color: #374151;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .edit-year-btn:hover, .edit-branch-btn:hover, .edit-section-btn:hover {
            border-color: #4a90e2;
            background: #eff6ff;
            color: #1d4ed8;
        }
        .edit-year-btn.active, .edit-branch-btn.active, .edit-section-btn.active {
            border-color: #4a90e2;
            background: #4a90e2;
            color: white;
        }
        #editTableWrapper table { margin-top: 0; }
        .edit-row-button, .cancel-row-button {
            border: 0; border-radius: 5px; padding: 6px 11px; cursor: pointer;
            background: #2563eb; color: white; font-size: 13px;
        }
        .cancel-row-button { background: #6b7280; margin-left: 5px; }
        .student-edit-input { width: 100%; box-sizing: border-box; padding: 7px; border: 1px solid #cbd5e1; border-radius: 5px; }
    `;
    document.head.appendChild(style);
}

// ─── File Handling ────────────────────────────────────────────────────────────
function handleEditFile(event) {
    const file = event.target.files[0];
    if (file) processEditFile(file);
}

function processEditFile(file) {
    const allowed = ['.csv', '.xlsx', '.xls'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
        setEditStatus(`❌ Unsupported file type "${ext}". Please upload .csv, .xlsx, or .xls`, 'red');
        return;
    }

    setEditStatus(`⏳ Parsing "${file.name}"...`, '#6b7280');
    setSaveAllButtonVisible(false);
    setGenerateFromUploadButtonVisible(false);

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            if (ext === '.csv') {
                const rows = parseCSV(e.target.result);
                processRows(rows, file.name);
            } else {
                // Use sheet-aware workbook processing for xlsx/xls
                const workbook = XLSX.read(e.target.result, { type: 'array' });
                processWorkbook(workbook, file.name);
            }
        } catch (err) {
            setEditStatus(`❌ Error parsing file: ${err.message}`, 'red');
        }
    };

    if (ext === '.csv') {
        reader.readAsText(file);
    } else {
        reader.readAsArrayBuffer(file);
    }
}

// ─── CSV Parser ───────────────────────────────────────────────────────────────
function parseCSV(text) {
    return text.split('\n').map(line =>
        line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
    ).filter(row => row.some(cell => cell !== ''));
}

// ─── Row Processing ───────────────────────────────────────────────────────────
/**
 * This file uses a sheet-per-section format:
 *   - Each sheet is named like "EEE", "ECE A", "CSE B", "CSE(AI&ML) A"
 *   - Rows 0-3: college header (skip)
 *   - Row 4: "Branch: EEE" or "Branch: CSE A" (used as fallback)
 *   - Row 5: column headers (S.No, Hall Ticket No, Name, <blank>, S.No, Hall Ticket No, Name)
 *   - Row 6+: dual-column student data
 *     Left:  col[0]=sno, col[1]=rollNo, col[2]=name
 *     Right: col[4]=sno, col[5]=rollNo, col[6]=name
 *
 * We process all sheets from the workbook.
 * Year is detected from title rows (e.g. "II B.TECH." → 2nd Year)
 */
function processRows(rows, filename) {
    // This function is called per-sheet; we override it with processWorkbook for xlsx/xls
    // For CSV fallback (single sheet, no sheet names), use legacy column detection
    if (!rows || rows.length < 2) {
        setEditStatus('❌ File appears to be empty or has no data rows.', 'red');
        return;
    }
    // Try legacy column-based parsing as fallback for CSV
    const header = rows[0].map(h => String(h).trim().toLowerCase());
    const colIdx = detectColumns(header);
    const parsed = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.every(c => String(c).trim() === '')) continue;
        const rollRaw = colIdx.roll !== -1 ? String(row[colIdx.roll] || '').trim() : '';
        const nameRaw = colIdx.name !== -1 ? String(row[colIdx.name] || '').trim() : '';
        const yearRaw = colIdx.year !== -1 ? String(row[colIdx.year] || '').trim() : '';
        const branchRaw = colIdx.branch !== -1 ? String(row[colIdx.branch] || '').trim() : '';
        const sectionRaw = colIdx.section !== -1 ? String(row[colIdx.section] || '').trim() : '';
        if (!rollRaw) continue;
        const { year, branch, section } = resolveYearBranchSection(yearRaw, branchRaw, sectionRaw, rollRaw);
        parsed.push({ sno: parsed.length + 1, rollNo: rollRaw.toLowerCase(), name: nameRaw || '—', year, branch, section });
    }
    if (parsed.length === 0) {
        setEditStatus('❌ No valid roll number data found. Check column headers.', 'red');
        return;
    }
    editParsedData = sortEditStudentRecords(parsed);
    setEditStatus(`✅ Parsed ${parsed.length} students from "${filename}"`, 'green');
    setSaveAllButtonVisible(true);
    setGenerateFromUploadButtonVisible(true);
    renderYearSelection();
}

/**
 * Process an entire workbook (xlsx/xls) where each sheet = one branch+section.
 * Sheet names like: "EEE", "ECE A", "ECE B", "CSE A"..."CSE F", "CSE(AI&ML) A", "CSE(AI&ML) B"
 */
function processWorkbook(workbook, filename) {
    const allStudents = [];

    workbook.SheetNames.forEach(sheetName => {
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '' });
        if (!rows || rows.length < 6) return;

        // Detect year from title rows (rows 0-3)
        let year = '2nd Year'; // default
        for (let r = 0; r < 4; r++) {
            const cell = String(rows[r][0] || '').toUpperCase();
            if (cell.includes('I B.TECH') && !cell.includes('II B.TECH') && !cell.includes('III B.TECH')) year = '1st Year';
            else if (cell.includes('II B.TECH') && !cell.includes('III B.TECH')) year = '2nd Year';
            else if (cell.includes('III B.TECH')) year = '3rd Year';
            else if (cell.includes('IV B.TECH') || cell.includes('4TH')) year = '4th Year';
        }

        // Parse branch and section from sheet name
        // e.g. "EEE" → branch=EEE, section=A
        // e.g. "ECE A" → branch=ECE, section=A
        // e.g. "CSE(AI&ML) B" → branch=AIML, section=B
        const { branch, section } = parseSheetName(sheetName);

        // Data rows start at row 6 (0-indexed), row 5 is the header
        for (let r = 6; r < rows.length; r++) {
            const row = rows[r];
            if (!row || row.every(c => String(c).trim() === '')) continue;

            // Left column: col[0]=sno, col[1]=roll, col[2]=name
            const leftRoll = String(row[1] || '').trim();
            const leftName = String(row[2] || '').trim();
            if (leftRoll && /wh/i.test(leftRoll)) {
                allStudents.push({
                    sno: allStudents.length + 1,
                    rollNo: leftRoll.toLowerCase(),
                    name: leftName || '—',
                    year, branch, section
                });
            }

            // Right column: col[4]=sno, col[5]=roll, col[6]=name
            const rightRoll = String(row[5] || '').trim();
            const rightName = String(row[6] || '').trim();
            if (rightRoll && /wh/i.test(rightRoll)) {
                allStudents.push({
                    sno: allStudents.length + 1,
                    rollNo: rightRoll.toLowerCase(),
                    name: rightName || '—',
                    year, branch, section
                });
            }
        }
    });

    if (allStudents.length === 0) {
        setEditStatus('❌ No valid student data found in the file.', 'red');
        return;
    }

    editParsedData = sortEditStudentRecords(allStudents);
    const sheetCount = workbook.SheetNames.length;
    setEditStatus(`✅ Parsed ${allStudents.length} students from ${sheetCount} sheets in "${filename}"`, 'green');
    setSaveAllButtonVisible(true);
    setGenerateFromUploadButtonVisible(true);
    renderYearSelection();
}

/**
 * Parse branch and section from a sheet name.
 * "EEE"            → { branch: 'EEE', section: 'A' }
 * "ECE A"          → { branch: 'ECE', section: 'A' }
 * "CSE B"          → { branch: 'CSE', section: 'B' }
 * "CSE(AI&ML) A"   → { branch: 'AIML', section: 'A' }
 * "CSE(AI&ML) B"   → { branch: 'AIML', section: 'B' }
 */
function parseSheetName(name) {
    const s = name.trim().toUpperCase();
    let branch = '';
    let section = 'A';

    if (s.includes('AI&ML') || s.includes('AIML') || s.includes('AI ML')) {
        branch = 'AIML';
    } else if (s.startsWith('CSE')) {
        branch = 'CSE';
    } else if (s.startsWith('ECE')) {
        branch = 'ECE';
    } else if (s.startsWith('EEE')) {
        branch = 'EEE';
    } else if (s.startsWith('MECH')) {
        branch = 'MECH';
    } else if (s.startsWith('CIVIL')) {
        branch = 'CIVIL';
    } else {
        branch = s.split(' ')[0];
    }

    // Extract section letter from the end: "ECE A" → A, "CSE F" → F
    const secMatch = s.match(/\b([A-Z])\s*$/);
    if (secMatch) {
        section = secMatch[1];
    }

    return { branch, section };
}

// ─── Column Detection ─────────────────────────────────────────────────────────
function detectColumns(header) {
    const find = (...keys) => {
        for (const k of keys) {
            const idx = header.findIndex(h => h.includes(k));
            if (idx !== -1) return idx;
        }
        return -1;
    };
    return {
        roll:    find('roll'),
        name:    find('name', 'student'),
        year:    find('year'),
        branch:  find('branch', 'dept', 'department'),
        section: find('section', 'class', 'sec')
    };
}

// ─── Year / Branch / Section Resolver ────────────────────────────────────────
const YEAR_MAP = {
    '1': '1st Year', 'i': '1st Year', '1st': '1st Year', '1st year': '1st Year', 'first': '1st Year',
    '2': '2nd Year', 'ii': '2nd Year', '2nd': '2nd Year', '2nd year': '2nd Year', 'second': '2nd Year',
    '3': '3rd Year', 'iii': '3rd Year', '3rd': '3rd Year', '3rd year': '3rd Year', 'third': '3rd Year',
    '4': '4th Year', 'iv': '4th Year', '4th': '4th Year', '4th year': '4th Year', 'fourth': '4th Year'
};

function resolveYearBranchSection(yearRaw, branchRaw, sectionRaw, rollNo) {
    let year = YEAR_MAP[yearRaw.toLowerCase()] || yearRaw || guessYearFromRoll(rollNo);
    let branch = normalizeBranch(branchRaw);
    let section = sectionRaw.toUpperCase() || '';

    // If section column contains combined info like "2nd Year CSE A"
    if (!branch && sectionRaw) {
        const combined = parseCombinedSection(sectionRaw);
        if (combined.year) year = combined.year;
        if (combined.branch) branch = combined.branch;
        if (combined.section) section = combined.section;
    }

    // Fallback: guess from roll number prefix (e.g. 24wh1a05xx → CSE 2nd year)
    if (!branch) branch = guessBranchFromRoll(rollNo);
    if (!year) year = guessYearFromRoll(rollNo);

    return { year: year || 'Unknown Year', branch: branch || 'Unknown Branch', section: section || 'A' };
}

function parseCombinedSection(str) {
    const result = { year: '', branch: '', section: '' };
    const s = str.toUpperCase();

    if (s.includes('1ST') || s.startsWith('1 ')) result.year = '1st Year';
    else if (s.includes('2ND') || s.startsWith('2 ')) result.year = '2nd Year';
    else if (s.includes('3RD') || s.startsWith('3 ')) result.year = '3rd Year';
    else if (s.includes('4TH') || s.startsWith('4 ')) result.year = '4th Year';

    if (s.includes('AIML')) result.branch = 'AIML';
    else if (s.includes('CSE')) result.branch = 'CSE';
    else if (s.includes('ECE')) result.branch = 'ECE';
    else if (s.includes('EEE')) result.branch = 'EEE';
    else if (s.includes('MECH')) result.branch = 'MECH';
    else if (s.includes('CIVIL')) result.branch = 'CIVIL';

    const secMatch = s.match(/\b([A-Z])\s*$/);
    if (secMatch) result.section = secMatch[1];

    return result;
}

function normalizeBranch(raw) {
    const b = raw.toUpperCase().trim();
    if (b.includes('AIML') || b.includes('AI')) return 'AIML';
    if (b.includes('CSE') || b.includes('COMPUTER')) return 'CSE';
    if (b.includes('ECE') || b.includes('ELECTRONICS')) return 'ECE';
    if (b.includes('EEE') || b.includes('ELECTRICAL')) return 'EEE';
    if (b.includes('MECH')) return 'MECH';
    if (b.includes('CIVIL')) return 'CIVIL';
    return b || '';
}

function guessBranchFromRoll(roll) {
    const r = roll.toLowerCase();
    // Common roll number patterns:
    // xxwh1a05xx → CSE  (05)
    // xxwh1a12xx → ECE  (12)
    // xxwh1a42xx → EEE  (42) or xxwh1a44xx
    // xxwh1a66xx → AIML (66)
    // Pattern: look for the branch code segment (digits after 'a')
    const match = r.match(/wh\d[a-z](\d{2})/);
    if (match) {
        const code = match[1];
        if (code === '05') return 'CSE';
        if (code === '12' || code === '55') return 'ECE';
        if (code === '42' || code === '44') return 'EEE';
        if (code === '66') return 'AIML';
    }
    // Fallback: check for branch name in roll itself
    if (r.includes('cse')) return 'CSE';
    if (r.includes('ece')) return 'ECE';
    if (r.includes('eee')) return 'EEE';
    if (r.includes('aiml')) return 'AIML';
    return '';
}

function guessYearFromRoll(roll) {
    const r = roll.toLowerCase();
    const match = r.match(/^(\d{2})wh/);
    if (!match) return '';
    const batch = parseInt(match[1]);
    // Current academic year approx 2025
    const diff = 25 - batch;
    if (diff === 0) return '1st Year';
    if (diff === 1) return '2nd Year';
    if (diff === 2) return '3rd Year';
    if (diff === 3) return '4th Year';
    return '';
}

// ─── UI: Year Selection ───────────────────────────────────────────────────────
// Always show all 4 years; grey out years with no data but still clickable
const ALL_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

function renderYearSelection() {
    const container = document.getElementById('yearButtons');
    container.innerHTML = '';

    ALL_YEARS.forEach(year => {
        const count = editParsedData.filter(s => s.year === year).length;
        const btn = document.createElement('button');
        btn.className = 'edit-year-btn';
        btn.textContent = count > 0 ? `${year} (${count})` : year;
        if (count === 0) {
            btn.style.opacity = '0.45';
            btn.title = 'No data uploaded for this year yet';
        }
        btn.onclick = () => {
            document.querySelectorAll('.edit-year-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderBranchSelection(year);
        };
        container.appendChild(btn);
    });

    document.getElementById('yearCard').style.display = 'block';
    document.getElementById('branchCard').style.display = 'none';
    document.getElementById('sectionCard').style.display = 'none';
    document.getElementById('tableCard').style.display = 'none';
}

// ─── UI: Branch Selection ─────────────────────────────────────────────────────
// Fixed branch display order
const BRANCH_ORDER = ['EEE', 'ECE', 'CSE', 'AIML', 'MECH', 'CIVIL'];

function renderBranchSelection(year) {
    const yearData = editParsedData.filter(s => s.year === year);

    // Get branches from data, sorted by preferred order
    const branchesInData = [...new Set(yearData.map(s => s.branch))];
    const branches = BRANCH_ORDER.filter(b => branchesInData.includes(b))
        .concat(branchesInData.filter(b => !BRANCH_ORDER.includes(b)).sort());

    document.getElementById('branchCardSub').textContent = `Year: ${year}`;
    const container = document.getElementById('branchButtons');
    container.innerHTML = '';

    if (branches.length === 0) {
        container.innerHTML = '<p style="color:#9ca3af;font-size:13px;">No data available for this year. Please upload a file containing this year\'s data.</p>';
        document.getElementById('branchCard').style.display = 'block';
        document.getElementById('sectionCard').style.display = 'none';
        document.getElementById('tableCard').style.display = 'none';
        return;
    }

    branches.forEach(branch => {
        const count = yearData.filter(s => s.branch === branch).length;
        // Count sections for this branch
        const sectionCount = [...new Set(yearData.filter(s => s.branch === branch).map(s => s.section))].length;
        const btn = document.createElement('button');
        btn.className = 'edit-branch-btn';
        btn.textContent = `${branch} (${sectionCount} section${sectionCount !== 1 ? 's' : ''}, ${count} students)`;
        btn.onclick = () => {
            document.querySelectorAll('.edit-branch-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderSectionSelection(year, branch);
        };
        container.appendChild(btn);
    });

    document.getElementById('branchCard').style.display = 'block';
    document.getElementById('sectionCard').style.display = 'none';
    document.getElementById('tableCard').style.display = 'none';

    // Scroll to branch card
    document.getElementById('branchCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── UI: Section Selection ────────────────────────────────────────────────────
function renderSectionSelection(year, branch) {
    const branchData = editParsedData.filter(s => s.year === year && s.branch === branch);
    const sections = [...new Set(branchData.map(s => s.section))].sort();

    document.getElementById('sectionCardSub').textContent = `${year} › ${branch}`;
    const container = document.getElementById('sectionButtons');
    container.innerHTML = '';

    sections.forEach(section => {
        const count = branchData.filter(s => s.section === section).length;
        const btn = document.createElement('button');
        btn.className = 'edit-section-btn';
        btn.textContent = `Section ${section} (${count})`;
        btn.onclick = () => {
            document.querySelectorAll('.edit-section-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderRollTable(year, branch, section);
        };
        container.appendChild(btn);
    });

    document.getElementById('sectionCard').style.display = 'block';
    document.getElementById('tableCard').style.display = 'none';

    document.getElementById('sectionCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── UI: Roll Number Table ────────────────────────────────────────────────────
function renderRollTable(year, branch, section) {
    const students = editParsedData
        .map((student, index) => ({ student, index }))
        .filter(({ student }) => student.year === year && student.branch === branch && student.section === section)
        .sort((a, b) => String(a.student.rollNo).localeCompare(
            String(b.student.rollNo), undefined, { numeric: true, sensitivity: 'base' }
        ));

    document.getElementById('tableCardTitle').textContent =
        `👥 ${year} › ${branch} › Section ${section}`;
    document.getElementById('tableCardSub').textContent =
        `${students.length} student${students.length !== 1 ? 's' : ''}. Use Edit on a row, then Save Changes.`;

    // Store current selection for save
    document.getElementById('tableCard').dataset.year = year;
    document.getElementById('tableCard').dataset.branch = branch;
    document.getElementById('tableCard').dataset.section = section;

    const wrapper = document.getElementById('editTableWrapper');
    if (students.length === 0) {
        wrapper.innerHTML = '<p style="color:#9ca3af;text-align:center;padding:20px;">No students found for this selection.</p>';
    } else {
        wrapper.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th style="width:60px;">S.No</th>
                        <th>Roll Number</th>
                        <th>Student Name</th>
                        <th style="width:150px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map(({ student, index }, rowIndex) => `
                        <tr id="student-row-${index}">
                            <td>${rowIndex + 1}</td>
                            <td class="student-roll-cell" style="font-family:monospace;">${escapeEditHTML(student.rollNo)}</td>
                            <td class="student-name-cell">${escapeEditHTML(student.name)}</td>
                            <td><button type="button" class="edit-row-button" onclick="editStudentRow(${index})">Edit</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    document.getElementById('tableCard').style.display = 'block';
    document.getElementById('tableCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function escapeEditHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
}

function editStudentRow(index) {
    const student = editParsedData[index];
    const row = document.getElementById(`student-row-${index}`);
    if (!student || !row) return;

    row.innerHTML = `
        <td>${index + 1}</td>
        <td><input class="student-edit-input" id="student-roll-${index}" value="${escapeEditHTML(student.rollNo)}" aria-label="Hall ticket number"></td>
        <td><input class="student-edit-input" id="student-name-${index}" value="${escapeEditHTML(student.name)}" aria-label="Student name"></td>
        <td class="student-edit-actions">
            <button type="button" class="edit-row-button" onclick="saveStudentRow(${index})">Save</button>
            <button type="button" class="cancel-row-button" onclick="cancelStudentRow(${index})">Cancel</button>
        </td>`;
}

function cancelStudentRow(index) {
    const student = editParsedData[index];
    if (student) renderRollTable(student.year, student.branch, student.section);
}

function saveStudentRow(index) {
    const rollNo = document.getElementById(`student-roll-${index}`)?.value.trim().toLowerCase();
    const name = document.getElementById(`student-name-${index}`)?.value.trim();
    const student = editParsedData[index];
    if (!student || !rollNo || !name) {
        alert('Enter both a hall-ticket number and student name.');
        return;
    }
    const duplicate = editParsedData.some((other, otherIndex) => otherIndex !== index &&
        other.year === student.year && other.branch === student.branch && other.section === student.section &&
        String(other.rollNo).toLowerCase() === rollNo);
    if (duplicate) {
        alert('That hall-ticket number is already in this section.');
        return;
    }
    student.rollNo = rollNo;
    student.name = name;
    renderRollTable(student.year, student.branch, student.section);
}

// ─── Save to ROLL_NUMBERS ─────────────────────────────────────────────────────
async function saveEditDataToRollNumbers() {
    const card = document.getElementById('tableCard');
    const year = card.dataset.year;
    const branch = card.dataset.branch;
    const section = card.dataset.section;

    if (!year || !branch || !section) return;

    const key = `${year} ${branch} ${section}`;
    const students = sortEditStudentRecords(editParsedData
        .filter(s => s.year === year && s.branch === branch && s.section === section)
    ).map(s => ({ rollNo: String(s.rollNo).trim().toLowerCase(), name: String(s.name || '').trim() }));

    if (!students.length) {
        alert('There are no student records in this section to save.');
        return;
    }

    if (typeof ROLL_NUMBERS !== 'undefined') {
        const record = {
            year,
            branch,
            section,
            students,
            updatedAt: new Date().toISOString()
        };
        try {
            await db.collection('studentSections').doc(encodeURIComponent(key)).set(record);
            ROLL_NUMBERS[key] = students.map(student => student.rollNo);
            alert(`✅ Saved ${students.length} student records under "${key}". They are available for seating generation.`);
        } catch (error) {
            alert(`Could not save student records: ${error.message}`);
        }
    } else {
        alert('⚠️ ROLL_NUMBERS not available. Make sure rollnumbers.js is loaded.');
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function setEditStatus(msg, color) {
    const el = document.getElementById('editFileStatus');
    if (el) { el.textContent = msg; el.style.color = color; }
}

function setSaveAllButtonVisible(visible) {
    const button = document.getElementById('saveAllStudentDataButton');
    if (button) button.style.display = visible ? 'inline-block' : 'none';
}

async function saveAllEditDataToSystem() {
    const groupedStudents = new Map();
    for (const student of editParsedData) {
        if (!student.rollNo || !student.year || !student.branch || !student.section) {
            alert('The uploaded file contains a student without a roll number, year, branch, or section. Fix the row before saving.');
            return false;
        }
        const key = `${student.year} ${student.branch} ${student.section}`;
        if (!groupedStudents.has(key)) {
            groupedStudents.set(key, {
                key,
                year: student.year,
                branch: student.branch,
                section: student.section,
                students: []
            });
        }
        groupedStudents.get(key).students.push({
            rollNo: String(student.rollNo).trim().toLowerCase(),
            name: String(student.name || '').trim()
        });
    }

    if (!groupedStudents.size) {
        alert('Upload a student file before saving the database.');
        return false;
    }

    const records = Array.from(groupedStudents.values(), record => ({
        ...record,
        updatedAt: new Date().toISOString()
    }));
    const studentCount = records.reduce((total, record) => total + record.students.length, 0);
    if (!confirm(`Replace the saved student database with ${studentCount} students across ${records.length} sections? Saved sections missing from this upload will be removed.`)) {
        return false;
    }

    const collection = db.collection('studentSections');
    try {
        const existing = await collection.get();
        const replacementIds = new Set(records.map(record => encodeURIComponent(record.key)));
        const operations = existing.docs
            .filter(doc => !replacementIds.has(doc.id))
            .map(doc => ({ type: 'delete', ref: doc.ref }))
            .concat(records.map(record => ({
                type: 'set',
                ref: collection.doc(encodeURIComponent(record.key)),
                data: {
                    year: record.year,
                    branch: record.branch,
                    section: record.section,
                    students: record.students,
                    updatedAt: record.updatedAt
                }
            })));

        for (let start = 0; start < operations.length; start += 450) {
            const batch = db.batch();
            operations.slice(start, start + 450).forEach(operation => {
                if (operation.type === 'delete') batch.delete(operation.ref);
                else batch.set(operation.ref, operation.data);
            });
            await batch.commit();
        }

        Object.keys(ROLL_NUMBERS).forEach(key => delete ROLL_NUMBERS[key]);
        applyStudentSectionRecords(records);
        setSaveAllButtonVisible(false);
        setEditStatus(`✅ Replaced the student database with ${studentCount} students across ${records.length} sections.`, 'green');
        alert('✅ Student database replaced. Seating generation will now use this uploaded roster.');
        return true;
    } catch (error) {
        setEditStatus(`Could not replace the student database: ${error.message}`, 'red');
        alert(`Could not replace the student database: ${error.message}`);
        return false;
    }
}

function setGenerateFromUploadButtonVisible(visible) {
    const button = document.getElementById('generateFromUploadButton');
    if (button) button.style.display = visible ? 'inline-block' : 'none';
}

async function saveRosterAndOpenGenerator() {
    const saved = await saveAllEditDataToSystem();
    if (saved) await showGenerateForm();
}
