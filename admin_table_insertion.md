# Feature Spec: Admin Student Database Management

**Module:** Admin Panel — Exam Seating Arrangement System
**Status:** New addition (must not modify or break existing functionality)
---

## 1. Purpose

Right now, to generate a seating arrangement the admin has no persistent, structured store of student data — it has to be re-supplied every time. This feature adds a one-time **Student Database Upload** to the Admin Panel that:

- Lets the admin upload the master Excel/CSV file containing all students across all branches and years.
- Parses it once and stores it permanently (no re-upload needed for future seating generations).
- Extracts and displays roll numbers (Hall Ticket Numbers) grouped by branch/section.
- Lets the admin view, add, or remove individual students afterward through the UI — without touching the file again.
- Lives entirely in a new sidebar section, so nothing about the current "Generate New Table" flow changes.

---

## 2. Source Data Format (from sample file)

The uploaded workbook has **one sheet per branch/section**: `EEE`, `ECE A`, `ECE B`, `CSE A`, `CSE B`, `CSE C`, `CSE D`, `CSE E`, `CSE F`, `CSE(AI&ML) A`, `CSE(AI&ML) B` (matches the tab names visible in the sample screenshot).

Within a sheet:
- A header row states `Branch: <NAME>` and `Date: <DD.MM.YYYY>`.
- Below that, one or more **tables**, each with columns: `S.No`, `Hall Ticket No.`, `Name of the Candidate`.
- Tables can appear **side-by-side** (e.g., columns A–C and columns E–G on the same rows).
- A sheet can contain **more than one batch/year** stacked vertically, distinguishable by the Hall Ticket No. prefix pattern (e.g., `25WH1A02xx` = one admission year, `26WH5A02xx` = another) — each batch has its own repeated header row (`S.No | Hall Ticket No. | Name of the Candidate`).

**Implication for parsing:** the extractor cannot assume a fixed single-column layout. It must scan each sheet for repeating `S.No / Hall Ticket No. / Name` header blocks (in any of the four "quadrants" — left/right, upper/lower) and pull all Hall Ticket No. + Name pairs it finds, rather than reading a fixed row/column range.

---

## 3. Roll Number Extraction Logic

For each sheet (= one branch/section):

1. Detect the branch name from the sheet tab name (fallback: from the `Branch:` cell text).
2. Scan the sheet for every occurrence of a header row matching `Hall Ticket No.` (case-insensitive, allowing for merged/side-by-side blocks).
3. For each header found, read downward until a blank row, collecting `Hall Ticket No.` and `Name of the Candidate`.
4. Normalize each Hall Ticket No. (trim whitespace, uppercase) and validate against the expected pattern (e.g., `^\d{2}[A-Z]{2}\dA0\d{3}$` — confirm exact pattern with your registrar's format, since two formats appear: `25WH1A02xx` and `26WH5A02xx`).
5. Tag each extracted record with:
   - `branch` (from sheet name)
   - `admissionYear`/`batch` (derived from the Hall Ticket prefix, e.g., `25` → 2025 batch, lateral entries like `26WH5A..` flagged separately if the prefix pattern differs)
   - `rollNo`
   - `name`
6. Skip rows that don't match the pattern; log them for the admin to review rather than silently dropping (see §7, error handling).

Output: one flat list of `{branch, batch, rollNo, name}` records per sheet, merged into a single dataset for the whole workbook.

---

## 4. Upload & Storage Behavior

- **Upload once, reuse forever:** After a successful upload, the parsed dataset is saved to the backend (database or persistent JSON/table storage — not just browser memory). On every subsequent admin panel load, the data loads from storage; the admin is not prompted to re-upload.
- **Re-upload / update:** Provide a "Replace Database" or "Re-upload" action for when a new year's list needs to be added or corrections need a fresh import. This should either:
  - **Merge** (add new records, skip/flag duplicates by roll number), or
  - **Overwrite** (replace entire dataset) — admin picks which behavior via a confirmation dialog, since this is destructive.
- **Accepted formats:** `.xlsx`, `.xls`, `.csv`. If `.csv`, treat the whole file as a single "sheet"/branch and ask the admin to tag the branch name at upload time (since CSV has no multi-sheet concept).
- **File size / row limits:** Define a sane cap (e.g., 10 MB / ~10,000 rows) and show a clear error if exceeded, rather than freezing the browser.

---

## 5. Admin Panel UI Changes

### 5.1 Sidebar Addition
Add a new entry to the existing left sidebar (alongside "All Tables"):

```
📋 All Tables
🎓 Student Database        ← NEW
🚪 Logout
```

Clicking **Student Database** expands/opens a panel with:

- **Branch dropdown** — populated dynamically from the branches found in the uploaded file (EEE, ECE A, ECE B, CSE A–F, CSE(AI&ML) A/B, etc.). No hardcoding of branch names, since the list should come from whatever the uploaded file contains.
- **Batch/Year dropdown** (secondary filter, since up to 4 years' students exist) — e.g., 1st Year, 2nd Year, 3rd Year, 4th Year, or by admission year (2023/2024/2025/2026), matched to whatever the Hall Ticket prefixes resolve to.
- **Student table view** — once a branch (and optionally batch) is selected, show a table: `S.No | Hall Ticket No. | Name`, matching the source layout so it's instantly recognizable to the admin.
- **Search box** — quick filter by roll number or name within the selected branch.

### 5.2 Upload Entry Point
- If no database has been uploaded yet: show an **"Upload Student Database"** button (Excel/CSV file picker) prominently in this panel, with a short instruction: *"Upload once — this file will be used for all future seating arrangements."*
- If a database already exists: show upload as a secondary **"Replace Database"** button instead, plus a small summary line: *"Last uploaded: [date] — [X] students across [Y] branches."*

### 5.3 Add / Remove Students
Within the branch/batch view:
- **Add Student** button opens a small form (Hall Ticket No., Name, Branch, Batch) → inserts one record into the stored dataset.
- **Remove** action (icon per row) → deletes that record after a confirmation prompt.
- **Edit** (optional but recommended) → inline edit of Name/Hall Ticket No. for typo corrections, since manual name/roll-number errors are common in these lists.
- All add/remove/edit actions write directly to the persistent store — they do **not** require re-uploading the Excel file.

---

## 6. Non-Disruption Requirements

Since this is being added to a live, working site:

- The existing **"Generate New Table"** button, its flow, and the **All Tables** view must remain fully functional and untouched.
- The new **Student Database** section must be a self-contained module (separate route/component/API endpoints) so a bug in it cannot break table generation.
- If the seating-generation logic will eventually **read from** this new student database (instead of manual entry), that integration should be a separate, later step/ticket — not bundled into this first release, to keep this change isolated and easy to test.
- Existing Logout, navigation, and layout/styling of the Admin Panel should not be visually or structurally altered beyond adding the one new sidebar item.

---

## 7. Edge Cases & Error Handling

| Case | Expected Behavior |
|---|---|
| Sheet name doesn't match a known branch pattern | Still import it; show it in the dropdown as-is (don't hardcode branch list) |
| Hall Ticket No. doesn't match expected pattern | Flag row in an "Issues" list post-upload; don't silently discard |
| Duplicate roll number (same student appears twice) | Warn admin; let them choose keep-first / keep-last / keep-both |
| Empty rows / merged cells in Excel | Skip gracefully, don't crash the parser |
| Admin removes a student who is already placed in a generated seating table | Warn that removal doesn't retroactively affect already-generated tables |
| Re-upload while tables already generated from old data | Clarify (via dialog) that this only updates the master list, not existing generated tables |

---

## 8. Suggested Data Model

```json
{
  "id": "uuid",
  "rollNo": "25WH1A0201",
  "name": "HARSITHA",
  "branch": "EEE",
  "batch": "2025",
  "uploadedAt": "2026-07-21T00:00:00Z",
  "source": "upload" // 
}
```

---

## 9. Rollout Steps (suggested build order)

1. Backend: storage schema + endpoints (`POST /students/upload`, `GET /students`, `POST /students`, `DELETE /students/:id`, `PUT /students/:id`).
2. Excel/CSV parser (multi-sheet, multi-quadrant table detection as in §3).
3. Sidebar UI: new "Student Database" entry + upload screen.
4. Branch/Batch dropdown + table view + search.
5. Add/Edit/Remove UI wired to backend.
6. QA pass confirming "All Tables" / "Generate New Table" flows are unaffected.