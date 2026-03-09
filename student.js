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
        
        const doc = await firebase.firestore()
            .collection('seatingArrangements')
            .doc(rollLower)
            .get();
        
        if (doc.exists) {
            const data = doc.data();
            console.log('Found data:', data);
            
            document.getElementById('loadingSection').style.display = 'none';
            document.getElementById('resultSection').style.display = 'block';
            
            document.getElementById('rollNumber').textContent = data.fullRollNo || rollNumber;
            document.getElementById('subject').textContent = data.subject || 'N/A';
            document.getElementById('examDate').textContent = data.examDate || 'N/A';
            document.getElementById('examTime').textContent = data.examTime || 'N/A';
            document.getElementById('classroom').textContent = data.classroom || 'N/A';
            document.getElementById('bench').textContent = data.bench || 'N/A';
        } else {
            console.log('No data found for:', rollLower);
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
