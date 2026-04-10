// Get roll number from URL
const urlParams = new URLSearchParams(window.location.search);
const rollNo = urlParams.get('roll');

if (!rollNo) {
    alert('⚠️ No roll number provided');
    window.location.href = 'index.html';
} else {
    searchSeat(rollNo);
}

async function searchSeat(rollNumber) {
    try {
        const rollLower = rollNumber.toLowerCase();
        console.log('Searching for:', rollNumber, '→', rollLower);
        
        // Get current date and time
        const now = new Date();
        const todayISO = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight
        
        // Get all tables for today
        const snapshot = await db.collection('examTables')
            .where('examDateISO', '==', todayISO)
            .get();
        
        if (snapshot.empty) {
            console.log('No exams scheduled for today');
            document.getElementById('loadingSection').style.display = 'none';
            document.getElementById('notFoundSection').style.display = 'block';
            document.getElementById('notFoundSection').innerHTML = '<p style="text-align: center;">No exams scheduled for today.</p><button onclick="goBack()" style="margin-top: 20px;">🏠 Go Back</button>';
            return;
        }
        
        // Find tables where exam is within 1 hour
        let eligibleTables = [];
        snapshot.forEach(doc => {
            const table = doc.data();
            const [hours, minutes] = table.examTime.split(':').map(Number);
            const examTimeMinutes = hours * 60 + minutes;
            const timeDiff = examTimeMinutes - currentTime;
            
            // Check if exam is within 1 hour (0 to 60 minutes from now)
            if (timeDiff > 0 && timeDiff <= 60) {
                eligibleTables.push({ id: doc.id, ...table, timeDiff });
            }
        });
        
        if (eligibleTables.length === 0) {
            console.log('No exams within 1 hour');
            document.getElementById('loadingSection').style.display = 'none';
            document.getElementById('notFoundSection').style.display = 'block';
            document.getElementById('notFoundSection').innerHTML = '<p style="text-align: center;">No exams within 1 hour. Please check back later.</p><button onclick="goBack()" style="margin-top: 20px;">🏠 Go Back</button>';
            return;
        }
        
        // Sort by nearest exam time
        eligibleTables.sort((a, b) => a.timeDiff - b.timeDiff);
        
        // Search for student in the nearest exam
        let found = false;
        for (let table of eligibleTables) {
            const seat = table.seatingData.find(s => 
                s.seat1 && s.seat1.rollNo.toLowerCase() === rollLower
            );
            
            if (seat) {
                console.log('Found student in table:', table.tableName);
                document.getElementById('loadingSection').style.display = 'none';
                document.getElementById('resultSection').style.display = 'block';
                
                document.getElementById('rollNumber').textContent = seat.seat1.rollNo;
                document.getElementById('subject').textContent = seat.seat1.subject || 'N/A';
                document.getElementById('examDate').textContent = table.examDate || 'N/A';
                document.getElementById('examTime').textContent = table.examTime || 'N/A';
                document.getElementById('classroom').textContent = seat.classroom || 'N/A';
                document.getElementById('bench').textContent = seat.bench || 'N/A';
                found = true;
                break;
            }
        }
        
        if (!found) {
            console.log('Student not found in any eligible exam');
            document.getElementById('loadingSection').style.display = 'none';
            document.getElementById('notFoundSection').style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error fetching seat:', error);
        alert('❌ Error fetching seat details: ' + error.message);
        document.getElementById('loadingSection').style.display = 'none';
        document.getElementById('notFoundSection').style.display = 'block';
    }
}

function goBack() {
    window.location.href = 'index.html';
}
