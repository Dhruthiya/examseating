function searchSeat() {
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
    
    // Get seating data from localStorage (persists across pages)
    const seatingData = localStorage.getItem('seatingData');
    const overflowData = localStorage.getItem('overflowData');
    
    if (!seatingData) {
        showError('No seating arrangement found. Please contact admin to generate seating first.');
        return;
    }
    
    const allSeats = JSON.parse(seatingData);
    const overflow = overflowData ? JSON.parse(overflowData) : [];
    
    // Search in main seating
    let found = false;
    for (let seat of allSeats) {
        // Check seat1
        if (seat.seat1 && seat.seat1.rollNo.toLowerCase().endsWith(searchInput)) {
            displayResult(
                seat.seat1.rollNo,
                seat.seat1.section,
                seat.classroom,
                seat.bench,
                seat.seat2 ? `${seat.seat2.rollNo} (${seat.seat2.section})` : 'No partner'
            );
            found = true;
            break;
        }
        // Check seat2
        if (seat.seat2 && seat.seat2.rollNo.toLowerCase().endsWith(searchInput)) {
            displayResult(
                seat.seat2.rollNo,
                seat.seat2.section,
                seat.classroom,
                seat.bench,
                `${seat.seat1.rollNo} (${seat.seat1.section})`
            );
            found = true;
            break;
        }
    }
    
    // Search in overflow if not found
    if (!found && overflow.length > 0) {
        // Need to reconstruct overflow seating
        const overflowSeating = allocateOverflowSeats(overflow);
        
        for (let seat of overflowSeating) {
            // Check seat1
            if (seat.seat1 && seat.seat1.rollNo.toLowerCase().endsWith(searchInput)) {
                displayResult(
                    seat.seat1.rollNo,
                    seat.seat1.section,
                    `Overflow-Class-${seat.classroom}`,
                    seat.bench,
                    seat.seat2 ? `${seat.seat2.rollNo} (${seat.seat2.section})` : 'No partner'
                );
                found = true;
                break;
            }
            // Check seat2
            if (seat.seat2 && seat.seat2.rollNo.toLowerCase().endsWith(searchInput)) {
                displayResult(
                    seat.seat2.rollNo,
                    seat.seat2.section,
                    `Overflow-Class-${seat.classroom}`,
                    seat.bench,
                    `${seat.seat1.rollNo} (${seat.seat1.section})`
                );
                found = true;
                break;
            }
        }
    }
    
    if (!found) {
        showError('Roll number not found. Please check and try again.');
    }
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

function displayResult(rollNo, section, classroom, bench, partner) {
    document.getElementById('rollNumber').textContent = rollNo;
    document.getElementById('section').textContent = section;
    document.getElementById('classroom').textContent = classroom;
    document.getElementById('benchNumber').textContent = bench;
    document.getElementById('benchPartner').textContent = partner;
    
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
