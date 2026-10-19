
# Seat Snap — Exam Seating Arrangement System

Seat Snap helps administrators prepare exam seating arrangements from student rosters. Students can find their assigned seat by entering their roll number; they do not need to sign in.

## Features

- Search for a seat using a full roll number
- Upload student rosters as CSV or Excel files
- Review and edit student records by year, branch, and section- Generate seating arrangements for selected years, branches, and rooms
- Fit up to eight leftover students into an extra row when room capacity allows
- Save and manage student rosters and exam tables in Firebase Firestore
- View seating results and export them as PDF or Excel

## How to use

### Students

1. Open the home page.
2. Enter your full roll number, such as `25wh1a0501`.
3. Select **Find My Seat** to see your seating details.

### Administrators

1. Sign in with Google using an approved admin account.
2. Open **Students Data** and upload a CSV or Excel roster.
3. Review the roster and save the records.
4. Generate an arrangement by choosing the semester, years, branches, exam details, and rooms.
5. Review, save, and manage the seating table.

Approved admin email addresses are configured in `login.js`.

For CSV uploads, use these headers:

```csv
Roll Number,Name,Year,Branch,Section
25wh1a0501,Student Name,2nd Year,CSE,A
```

`Roll Number` is required. Upload the CSV from the matching year card; include the other columns when available.

## Run locally

This is a static HTML, CSS, and JavaScript app; it does not need a build step. From the project folder, start a local web server:

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

To use Google Sign-In locally, add `http://localhost:8080` as an authorized JavaScript origin for the Google OAuth client configured in `index.html`.

## Services and configuration

- **Google Identity Services** provides Google Sign-In. Add the local and production site origins to the OAuth client's authorized JavaScript origins. The client ID is in `index.html`, and approved admin email addresses are in `login.js`.
- **Firebase Firestore** stores student rosters in `studentSections` and saved exam tables in `examTables`. The web app's Firebase configuration is in `firebase-config-simple.js`.
- Set up a Firebase project with Firestore and update `firebase-config-simple.js` if using a different project. Student lookup and admin data operations require that project to be available.
- Google Sign-In and the admin email check currently run in the browser. This is a UI gate, not secure authorization. The repository setup guide specifies Firestore test mode (permissive rules); live rules are not tracked here, so confirm them in Firebase Console. Protect sensitive database operations with Firebase Authentication and Firestore Security Rules.

## Deploy to Vercel

Install the Vercel CLI, sign in, and link the project the first time you deploy:

```bash
npm install -g vercel
vercel login
vercel link
vercel --prod
```

Choose the existing `examseating` project when linking. The signed-in Vercel account must have access to it. The production site is [examseating-three.vercel.app](https://examseating-three.vercel.app).

For a different deployment, replace the Firebase web configuration in `firebase-config-simple.js`, use your own Google OAuth client ID in `index.html`, and add the deployed site origin to that OAuth client.

## Main files

- `index.html` — home page and student roll-number search
- `admin.html` — admin dashboard
- `edit-data.js` — roster upload and editing
- `app-multiyear.js` — multi-year seating generation
- `results.html` and `results.js` — saved seating results and exports
- `student.html` and `student.js` — student seat lookup results

## Tech stack

- HTML, CSS, and vanilla JavaScript
- Google Identity Services
- Firebase Firestore
- Vercel


