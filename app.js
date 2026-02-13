let seatingData = [];

document.getElementById('csvFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('studentData').value = e.target.result;
        };
        reader.readAsText(file);
    }
});

function generateArrangement() {
    const classrooms = parseInt(document.getElementById('classrooms').value);
    const studentText = document.getElementById('studentData').value.trim();
    
    if (!classrooms || !studentText) {
        alert('Please fill all fields');
        return;
    }
    
    const students = parseStudents(studentText);
    const totalCapacity = classrooms * 28 * 2;
    
    if (students.length > totalCapacity) {
        alert(`Capacity exceeded! Max: ${totalCapacity}, Students: ${students.length}`);
        return;
    }
    
    seatingData = allocateSeats(students, classrooms);
    displayTable(seatingData);
    document.getElementById('output').style.display = 'block';
}

function parseStudents(text) {
    return text.split('\n')
        .filter(line => line.trim())
        .map(line => {
            const parts = line.split(',').map(p => p.trim());
            return {
                rollNo: parts[0],
                name: parts[1],
                class: parts[2],
                branch: parts[3]
            };
        });
}

function allocateSeats(students, classrooms) {
    const branchGroups = {};
    students.forEach(s => {
        if (!branchGroups[s.branch]) branchGroups[s.branch] = [];
        branchGroups[s.branch].push(s);
    });
    
    const result = [];
    let studentIndex = {};
    Object.keys(branchGroups).forEach(b => studentIndex[b] = 0);
    
    for (let room = 1; room <= classrooms; room++) {
        for (let bench = 1; bench <= 28; bench++) {
            const branches = Object.keys(branchGroups).filter(b => 
                studentIndex[b] < branchGroups[b].length
            );
            
            if (branches.length === 0) break;
            
            branches.sort((a, b) => 
                (branchGroups[b].length - studentIndex[b]) - 
                (branchGroups[a].length - studentIndex[a])
            );
            
            const branch1 = branches[0];
            const student1 = branchGroups[branch1][studentIndex[branch1]++];
            
            let student2 = null;
            const otherBranches = branches.filter(b => b !== branch1);
            
            if (otherBranches.length > 0) {
                const branch2 = otherBranches[0];
                student2 = branchGroups[branch2][studentIndex[branch2]++];
            } else if (studentIndex[branch1] < branchGroups[branch1].length) {
                student2 = branchGroups[branch1][studentIndex[branch1]++];
            }
            
            result.push({
                classroom: room,
                bench: bench,
                seat1: student1,
                seat2: student2
            });
            
            if (!student2) break;
        }
    }
    
    return result;
}

function displayTable(data) {
    let html = '<table><thead><tr>';
    html += '<th>Classroom</th><th>Bench</th>';
    html += '<th>Roll No</th><th>Name</th><th>Branch</th>';
    html += '<th>Roll No</th><th>Name</th><th>Branch</th>';
    html += '</tr></thead><tbody>';
    
    data.forEach(row => {
        html += `<tr>
            <td>${row.classroom}</td>
            <td>${row.bench}</td>
            <td>${row.seat1.rollNo}</td>
            <td>${row.seat1.name}</td>
            <td>${row.seat1.branch}</td>
            <td>${row.seat2 ? row.seat2.rollNo : '-'}</td>
            <td>${row.seat2 ? row.seat2.name : '-'}</td>
            <td>${row.seat2 ? row.seat2.branch : '-'}</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    document.getElementById('tableContainer').innerHTML = html;
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
        row.seat1.branch,
        row.seat2 ? row.seat2.rollNo : '-',
        row.seat2 ? row.seat2.name : '-',
        row.seat2 ? row.seat2.branch : '-'
    ]);
    
    doc.autoTable({
        head: [['Room', 'Bench', 'Roll No', 'Name', 'Branch', 'Roll No', 'Name', 'Branch']],
        body: tableData,
        startY: 20,
        styles: { fontSize: 8 }
    });
    
    doc.save('seating-arrangement.pdf');
}

function downloadExcel() {
    const data = seatingData.map(row => ({
        'Classroom': row.classroom,
        'Bench': row.bench,
        'Seat1 Roll No': row.seat1.rollNo,
        'Seat1 Name': row.seat1.name,
        'Seat1 Branch': row.seat1.branch,
        'Seat2 Roll No': row.seat2 ? row.seat2.rollNo : '-',
        'Seat2 Name': row.seat2 ? row.seat2.name : '-',
        'Seat2 Branch': row.seat2 ? row.seat2.branch : '-'
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Seating');
    XLSX.writeFile(wb, 'seating-arrangement.xlsx');
}
