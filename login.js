// Google Sign-In callback (Admin)
function handleGoogleLogin(response) {
    const userInfo = parseJwt(response.credential);
    
    if (!userInfo.email.endsWith('@bvrithyderabad.edu.in')) {
        alert('❌ Only @bvrithyderabad.edu.in emails are allowed!');
        return;
    }
    
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userEmail', userInfo.email);
    sessionStorage.setItem('userName', userInfo.name);
    sessionStorage.setItem('userPicture', userInfo.picture);
    sessionStorage.setItem('userRole', 'admin');
    
    window.location.href = 'index.html';
}

// Traditional Login (Student)
document.getElementById('studentLoginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const rollNumber = document.getElementById('rollNumber').value.trim();
    
    if (rollNumber) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('studentRollNumber', rollNumber);
        sessionStorage.setItem('userRole', 'student');
        window.location.href = 'student.html';
    }
});

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
