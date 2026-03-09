# Exam Seating Arrangement System

## 🚀 Quick Setup

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "Exam Seating System"
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen:
   - User Type: External
   - App name: Exam Seating System
   - User support email: your-email@gmail.com
   - Developer contact: your-email@gmail.com
6. Create OAuth Client ID:
   - Application type: Web application
   - Name: Exam Seating Web
   - Authorized JavaScript origins:
     ```
     http://localhost:8080
     https://your-vercel-app.vercel.app
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:8080
     https://your-vercel-app.vercel.app
     ```
7. Copy the **Client ID**

### 2. ~~Update home.html~~ ✅ Already configured!

Your Google OAuth Client ID is already set up in `home.html`:
```
80284631535-bf0igbecrqsfgsbkiqe77plh0jtuhdok.apps.googleusercontent.com
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd /home/cse/examseating
vercel --prod
```

### 4. Update OAuth URLs

After deployment, add your Vercel URL to Google Cloud Console:
- Authorized JavaScript origins: `https://your-app.vercel.app`
- Authorized redirect URIs: `https://your-app.vercel.app`

## 📋 Features

- ✅ Student search by full roll number
- ✅ Google OAuth admin login (only navyachinta31545@gmail.com)
- ✅ Manual save to localStorage
- ✅ Shuffle saves latest version
- ✅ No Firebase backend needed
- ✅ Bench number in seating details

## 🔒 Admin Access

Only **navyachinta31545@gmail.com** can access the admin panel.

## 📱 Usage

### For Students:
1. Go to home page
2. Enter full roll number (e.g., 25wh1a0501)
3. Click Search
4. View seat details with bench number

### For Admin:
1. Click "Sign in with Google"
2. Login with authorized email
3. Generate seating arrangement
4. Click "Save Data" to make it available to students
5. Use "Shuffle" to randomize (auto-saves)

## 🛠️ Tech Stack

- Pure HTML/CSS/JavaScript
- Google OAuth (no backend)
- localStorage for data persistence
- Vercel for hosting
