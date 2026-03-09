// Google Sign-In callback - Admin Only
async function handleGoogleLogin(response) {
    const userInfo = parseJwt(response.credential);
    const email = userInfo.email;
    const errorMsg = document.getElementById('errorMsg');
    
    console.log('🔐 Google login attempt:', email);
    
    // Check if admin (only authorized email)
    if (email === 'navyachinta31545@gmail.com') {
        console.log('✅ Admin login successful');
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', email);
        sessionStorage.setItem('userName', userInfo.name);
        sessionStorage.setItem('userPicture', userInfo.picture);
        sessionStorage.setItem('userRole', 'admin');
        window.location.href = 'index.html';
        return;
    }
    
    // Unauthorized email
    console.log('❌ Unauthorized email:', email);
    errorMsg.textContent = '❌ Unauthorized. Only navyachinta31545@gmail.com can access admin panel.';
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
