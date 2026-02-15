# Firebase Setup Guide

## ✅ Updates Completed:

1. **Firebase Integration** - Data now saves to cloud database
2. **Admin Login** - Secured via Google OAuth Testing mode
3. **Student Search** - Searches Firebase first, localStorage as fallback

---

## 🔧 Firebase Setup (Required):

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it: `exam-seating-system`
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Firestore Database

1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Select "Start in **test mode**" (for now)
4. Choose location: `asia-south1` (Mumbai)
5. Click "Enable"

### Step 3: Get Firebase Config

1. Click ⚙️ (Settings) → Project Settings
2. Scroll to "Your apps" section
3. Click the Web icon `</>`
4. Register app name: `exam-seating-web`
5. Copy the `firebaseConfig` object

### Step 4: Update firebase-config.js

Replace lines 6-12 in `firebase-config.js` with your config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### Step 5: Test Locally

```bash
cd /home/cse/examseating
python3 -m http.server 8080
```

Open: http://localhost:8080/home.html

1. Login as admin (Google OAuth)
2. Generate seating arrangement
3. Check browser console - should see "✅ Saved to Firebase successfully"
4. Go to Firebase Console → Firestore Database
5. You should see `seatingArrangements` collection with data

### Step 6: Test Student Search

1. Logout
2. Login with email/password as student
3. Search for a roll number (last 4 digits)
4. Should fetch from Firebase

---

## 🚀 Deploy to Netlify:

### Option 1: Drag & Drop (Easiest)

1. Go to https://app.netlify.com/drop
2. Drag the entire `/home/cse/examseating` folder
3. Get URL like: `https://random-name.netlify.app`

### Option 2: GitHub (Recommended)

```bash
cd /home/cse/examseating
git add .
git commit -m "Add Firebase integration"
git push
```

Then:
1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import from Git"
3. Connect GitHub
4. Select your repo
5. Click "Deploy"

### Step 7: Update Google OAuth

After deployment, add your Netlify URL to Google Cloud Console:

**Authorized JavaScript origins:**
```
https://your-site.netlify.app
```

**Authorized redirect URIs:**
```
https://your-site.netlify.app
https://your-site.netlify.app/home.html
```

---

## 📊 How It Works Now:

### Admin Flow:
1. Admin signs in with Google (only whitelisted email in Testing mode)
2. Generates seating arrangement
3. Data saves to:
   - ✅ localStorage (for immediate display)
   - ✅ Firebase Firestore (for cloud storage)
4. All students can now search from anywhere

### Student Flow:
1. Student signs in with email/password
2. Enters last 4 digits of roll number
3. System searches Firebase first
4. If Firebase fails, falls back to localStorage
5. Displays seat information

---

## 🔒 Security:

- **Admin Access**: Only your email (set in Google OAuth Testing mode)
- **Firebase**: Test mode (anyone can read/write) - Change to production rules later
- **Data**: Stored in cloud, accessible from any device

---

## 📝 Production Firestore Rules (Optional):

Once tested, update Firestore rules for security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /seatingArrangements/{document} {
      allow read: if true;  // Anyone can read
      allow write: if request.auth != null;  // Only authenticated users can write
    }
  }
}
```

---

## ✅ Checklist:

- [ ] Create Firebase project
- [ ] Enable Firestore Database
- [ ] Copy Firebase config to `firebase-config.js`
- [ ] Test locally (generate + search)
- [ ] Deploy to Netlify
- [ ] Update Google OAuth URLs
- [ ] Test live website

**All done! Your exam seating system is now cloud-powered! 🎉**
