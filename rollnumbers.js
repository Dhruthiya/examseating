// Roll numbers are loaded from the admin Edit section and stored in Firestore.
const ROLL_NUMBERS = {};

// ─── Utility Functions ────────────────────────────────────────────────────────

function getAllRollNumbers() {
  return Object.values(ROLL_NUMBERS).flat();
}

function getRollNumbersBySection(section) {
  return ROLL_NUMBERS[section] || [];
}

function findStudentSection(rollNumber) {
  const roll = rollNumber.toLowerCase();
  for (const [section, rolls] of Object.entries(ROLL_NUMBERS)) {
    if (rolls.some(r => r.toLowerCase() === roll)) {
      return section;
    }
  }
  return null;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ROLL_NUMBERS, getAllRollNumbers, getRollNumbersBySection, findStudentSection };
}
