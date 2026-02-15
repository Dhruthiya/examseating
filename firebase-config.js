// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save seating arrangement to Firestore
export async function saveSeatingArrangement(data) {
    try {
        const docRef = await addDoc(collection(db, 'seatingArrangements'), {
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
export async function getAllSeatingArrangements() {
    try {
        const querySnapshot = await getDocs(collection(db, 'seatingArrangements'));
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
export async function searchStudentByRoll(rollNumber) {
    try {
        const q = query(collection(db, 'seatingArrangements'), where('rollNumber', '==', rollNumber));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            return { success: false, error: 'Student not found' };
        }
        
        const studentData = querySnapshot.docs[0].data();
        return { success: true, data: studentData };
    } catch (error) {
        console.error('Error searching Firebase:', error);
        return { success: false, error: error.message };
    }
}

// Clear all seating arrangements
export async function clearAllArrangements() {
    try {
        const querySnapshot = await getDocs(collection(db, 'seatingArrangements'));
        const deletePromises = [];
        querySnapshot.forEach((document) => {
            deletePromises.push(deleteDoc(doc(db, 'seatingArrangements', document.id)));
        });
        await Promise.all(deletePromises);
        return { success: true };
    } catch (error) {
        console.error('Error clearing Firebase:', error);
        return { success: false, error: error.message };
    }
}
