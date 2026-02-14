# Google OAuth Setup Guide

## Steps to Enable Google Login

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5000`
     - `http://localhost:8000` (if using different port)
   - Add authorized redirect URIs:
     - `http://localhost:5000`
   - Click "Create"
   - Copy the **Client ID**

### 2. Update Your Code

Replace `YOUR_GOOGLE_CLIENT_ID` in these files with your actual Client ID:

1. **backend/app.py** (line 11):
   ```python
   GOOGLE_CLIENT_ID = "your-actual-client-id.apps.googleusercontent.com"
   ```

2. **login.html** (line 73):
   ```javascript
   const GOOGLE_CLIENT_ID = 'your-actual-client-id.apps.googleusercontent.com';
   ```

### 3. Install Dependencies

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Start the Backend

```bash
cd backend
python app.py
```

### 5. Access the Application

Open your browser and go to:
```
http://localhost:5000/login.html
```

## How It Works

1. User clicks "Sign in with Google" on login page
2. Google OAuth popup appears
3. User selects Google account
4. Backend verifies the token
5. Session is created
6. User is redirected to the main application
7. All API calls require authentication
8. User can logout anytime

## Security Notes

- Sessions are stored server-side
- All protected routes check for valid session
- Logout clears the session
- Unauthorized users are redirected to login page
