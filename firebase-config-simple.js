// Import Firebase scripts (add these to HTML first)
// <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>

const firebaseConfig = {
    apiKey: "AIzaSyCOk7xto67cyLh5yr9dN73FIhEPI_yiuuI",
    authDomain: "exam-seating-28948.firebaseapp.com",
    projectId: "exam-seating-28948",
    storageBucket: "exam-seating-28948.firebasestorage.app",
    messagingSenderId: "260717976116",
    appId: "1:260717976116:web:acbf6a571286ce1afb8861",
    measurementId: "G-XGR8LKTN3K"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Save seating arrangement to Firestore
async function saveSeatingArrangement(data) {
    try {
        const docRef = await db.collection('seatingArrangements').add({
            ...data,
            timestamp: new Date().toISOString()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error saving to Firebase:', error);
        return { success: false, error: error.message };
    }
}

// Get all seating arrangements
async function getAllSeatingArrangements() {
    try {
        const querySnapshot = await db.collection('seatingArrangements').get();
        const arrangements = [];
        querySnapshot.forEach((doc) => {
            arrangements.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: arrangements };
    } catch (error) {
        console.error('Error fetching from Firebase:', error);
        return { success: false, error: error.message };
    }
}

// Search student by roll number
async function searchStudentByRoll(rollNumber) {
    try {
        console.log('🔍 Searching Firebase for rollNumber:', rollNumber);
        
        const querySnapshot = await db.collection('seatingArrangements')
            .where('rollNumber', '==', rollNumber)
            .get();
        
        console.log('📊 Query returned', querySnapshot.size, 'documents');
        
        if (querySnapshot.empty) {
            // Debug: show what's actually in the database
            const allDocs = await db.collection('seatingArrangements').limit(5).get();
            console.log('Sample data in Firebase:');
            allDocs.forEach(doc => {
                console.log('  -', doc.data().rollNumber, '(full:', doc.data().fullRollNo, ')');
            });
            return { success: false, error: 'Student not found' };
        }
        
        const studentData = querySnapshot.docs[0].data();
        console.log('✅ Found student:', studentData);
        return { success: true, data: studentData };
    } catch (error) {
        console.error('Error searching Firebase:', error);
        return { success: false, error: error.message };
    }
}

// Clear all seating arrangements
async function clearAllArrangements() {
    try {
        const querySnapshot = await db.collection('seatingArrangements').get();
        const deletePromises = [];
        querySnapshot.forEach((doc) => {
            deletePromises.push(doc.ref.delete());
        });
        await Promise.all(deletePromises);
        return { success: true };
    } catch (error) {
        console.error('Error clearing Firebase:', error);
        return { success: false, error: error.message };
    }
}
