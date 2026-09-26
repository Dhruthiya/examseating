// Approved admin accounts used by the Google Sign-In flow and admin page guard.
window.ADMIN_EMAILS = [
    'navyachinta31545@gmail.com',
    'sriyajami08@gmail.com',
    'kamalhasiniemani@gmail.com',
    'aasifa.zaina@gmail.com',
    'dhruthiyagillala@gmail.com'
];

// Google Sign-In callback
async function handleGoogleLogin(response) {
    const userInfo = parseJwt(response.credential);
    const email = String(userInfo.email || '').trim().toLowerCase();
    const errorMsg = document.getElementById('errorMsg');
    
    console.log('🔐 Google login attempt:', email);
    
    // Check if admin
    if (window.ADMIN_EMAILS.includes(email)) {
        console.log('✅ Admin login successful');
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', email);
        sessionStorage.setItem('userName', userInfo.name);
        sessionStorage.setItem('userPicture', userInfo.picture);
        sessionStorage.setItem('userRole', 'admin');
        window.location.href = 'admin.html';
        return;
    }
    
    // Check if student email pattern: 25wh1a____@bvrithyderabad.edu.in
    const studentPattern = /^25wh1a([0-9a-z]{4})@bvrithyderabad\.edu\.in$/i;
    const match = email.match(studentPattern);
    
    if (match) {
        const rollNumber = match[1].toLowerCase();
        console.log('🎓 Student login detected. Roll number:', rollNumber);
        
        // Check if Firebase functions are available
        if (typeof searchStudentByRoll === 'undefined') {
            errorMsg.textContent = '❌ Firebase not connected. Please contact admin.';
            errorMsg.style.display = 'block';
            return;
        }
        
        // Search Firebase for this student
        try {
            const result = await searchStudentByRoll(rollNumber);
            
            if (result.success) {
                console.log('✅ Student found in database');
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userEmail', email);
                sessionStorage.setItem('userName', userInfo.name);
                sessionStorage.setItem('userPicture', userInfo.picture);
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
    
    // Unauthorized email
    console.log('❌ Unauthorized email:', email);
    errorMsg.textContent = '❌ Unauthorized email. Only admin or students with @bvrithyderabad.edu.in can login.';
    errorMsg.style.display = 'block';
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
