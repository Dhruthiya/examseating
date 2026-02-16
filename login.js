document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');
    
    errorMsg.style.display = 'none';
    
    // Admin login
    if (email === 'navyachinta31545@gmail.com' && password === '14181110') {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', email);
        sessionStorage.setItem('userRole', 'admin');
        window.location.href = 'index.html';
        return;
    }
    
    // Student login - pattern: 25wh1a____@bvrithyderabad.edu.in
    const studentPattern = /^25wh1a([0-9a-z]{4})@bvrithyderabad\.edu\.in$/i;
    const match = email.match(studentPattern);
    
    if (match) {
        const rollNumber = match[1].toLowerCase(); // Last 4 digits
        
        console.log('🔍 Searching for roll number:', rollNumber);
        
        // Check if Firebase functions are available
        if (typeof searchStudentByRoll === 'undefined') {
            errorMsg.textContent = '❌ Firebase not connected. Please contact admin.';
            errorMsg.style.display = 'block';
            return;
        }
        
        // Search Firebase for this student
        try {
            const result = await searchStudentByRoll(rollNumber);
            console.log('Firebase result:', result);
            
            if (result.success) {
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userEmail', email);
                sessionStorage.setItem('userRole', 'student');
                sessionStorage.setItem('rollNumber', rollNumber);
                sessionStorage.setItem('studentData', JSON.stringify(result.data));
                window.location.href = 'student.html';
            } else {
                errorMsg.textContent = '❌ Seating arrangement not allotted yet. Please contact admin.';
                errorMsg.style.display = 'block';
            }
        } catch (error) {
            console.error('Search error:', error);
            errorMsg.textContent = '❌ Error searching data: ' + error.message;
            errorMsg.style.display = 'block';
        }
        return;
    }
    
    // Invalid credentials
    errorMsg.textContent = '❌ Invalid email or password';
    errorMsg.style.display = 'block';
});
