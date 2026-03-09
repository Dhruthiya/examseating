async function searchSeat() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultSection = document.getElementById('resultSection');
    const errorMessage = document.getElementById('errorMessage');
    
    // Hide previous results
    resultSection.style.display = 'none';
    errorMessage.style.display = 'none';
    
    if (searchInput.length !== 4) {
        showError('Please enter exactly 4 characters');
        return;
    }
    
    // Search Firebase only
    console.log('Searching Firebase for roll:', searchInput);
    const firebaseResult = await searchStudentByRoll(searchInput);
    
    if (firebaseResult.success) {
        const student = firebaseResult.data;
        displayResult(student);
        return;
    }
    
    // Not found in Firebase
    showError('Roll number not found. Please check and try again or contact admin.');
}

function allocateOverflowSeats(students) {
    const result = [];
    let currentRoom = 1;
    let currentBench = 1;
    
    const remaining = [...students];
    
    while (remaining.length > 0) {
        const student1 = remaining.shift();
        let student2 = null;
        
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

function displayResult(data) {
    // Firebase format only
    const rollNo = data.rollNumber || data.fullRollNo;
    const section = data.section;
    const classroom = data.classroom;
    const bench = data.bench;
    const partner = data.partner;
    const subject = data.subject;
    const examDate = data.examDate;
    const examTime = data.examTime;
    
    // Calculate row and column based on bench number
    const column = Math.ceil(bench / 8);
    const row = ((bench - 1) % 8) + 1;
    
    document.getElementById('subject').textContent = subject;
    document.getElementById('examDate').textContent = examDate;
    document.getElementById('examTime').textContent = examTime;
    document.getElementById('classroom').textContent = classroom;
    document.getElementById('column').textContent = column;
    document.getElementById('row').textContent = row;
    
    document.getElementById('resultSection').style.display = 'block';
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Allow Enter key to search
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchSeat();
        }
    });
});
