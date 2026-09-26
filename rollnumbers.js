// Roll Numbers Data for All Years and Sections
const ROLL_NUMBERS = {
  // 1st Year (2025 batch)
  "1st Year CSE A": generateRange("25wh1a0501", "25wh1a0564"),
  "1st Year CSE B": [...generateRange("25wh1a0565", "25wh1a0599").slice(0, 35), ...generateAlphaRange("25wh1a05a0", "25wh1a05c8")],
  "1st Year CSE C": generateAlphaRange("25wh1a05c9", "25wh1a05k3", ['i']),
  "1st Year CSE D": generateAlphaRange("25wh1a05k4", "25wh1a05r7", ['i', 'o']),
  "1st Year CSE E": generateAlphaRange("25wh1a05r8", "25wh1a05z1", ['i', 'o', 's']),
  "1st Year CSE F": [...generateAlphaRange("25wh1a05z2", "25wh1a05z9", ['i', 'o', 's']), ...generateDoubleAlphaRange("25wh1a05aa", "25wh1a05cj", ['i', 'o', 's'], true)],
  "1st Year AIML A": generateRange("25wh1a6601", "25wh1a6664"),
  "1st Year AIML B": [...generateRange("25wh1a6665", "25wh1a6699"), ...generateAlphaRange("25wh1a66a0", "25wh1a66c8")],
  "1st Year ECE A": generateRange("25wh1a5501", "25wh1a5564"),
  "1st Year ECE B": [...generateRange("25wh1a5565", "25wh1a5599"), ...generateAlphaRange("25wh1a55a0", "25wh1a55c8")],
  "1st Year EEE": generateRange("25wh1a4401", "25wh1a4464"),

  // 2nd Year (2024 batch)
  "2nd Year CSE A": [...generateRange("24wh1a0501", "24wh1a0564"), ...generateRange("25wh5a0501", "25wh5a0507")],
  "2nd Year CSE B": [...generateRange("24wh1a0565", "24wh1a0599"), ...generateAlphaRange("24wh1a05a0", "24wh1a05c8"), ...generateRange("25wh5a0508", "25wh5a0514")],
  "2nd Year CSE C": [...generateAlphaRange("24wh1a05c9", "24wh1a05k2"), ...generateRange("25wh5a0515", "25wh5a0521")],
  "2nd Year CSE D": [...generateAlphaRange("24wh1a05k3", "24wh1a05r6"), ...generateRange("25wh5a0522", "25wh5a0528")],
  "2nd Year CSE E": [...generateAlphaRange("24wh1a05r7", "24wh1a05z0"), ...generateRange("25wh5a0529", "25wh5a0535")],
  "2nd Year CSE F": [...generateDoubleAlphaRange("24wh1a05aa", "24wh1a05ch", ['i', 'o', 's']), ...generateAlphaRange("24wh1a05z1", "24wh1a05z9"), ...generateRange("25wh5a0536", "25wh5a0541")],
  "2nd Year AIML A": generateRange("24wh1a6601", "24wh1a6664"),
  "2nd Year AIML B": [...generateRange("24wh1a6665", "24wh1a6699"), ...generateAlphaRange("24wh1a66a0", "24wh1a66c8")],
  "2nd Year ECE A": generateRange("24wh1a5501", "24wh1a5564"),
  "2nd Year ECE B": [...generateRange("24wh1a5565", "24wh1a5599"), ...generateAlphaRange("24wh1a55a0", "24wh1a55c8")],
  "2nd Year EEE": generateRange("24wh1a4401", "24wh1a4464"),

  // 3rd Year (2023 batch)
  "3rd Year CSE A": [...generateRange("23wh1a0501", "23wh1a0564"), ...generateRange("24wh5a0501", "24wh5a0506")],
  "3rd Year CSE B": [...generateRange("23wh1a0565", "23wh1a0599"), ...generateAlphaRange("23wh1a05a0", "23wh1a05c8", [], ["b4"]), ...generateRange("24wh5a0507", "24wh5a0512")],
  "3rd Year CSE C": [...generateAlphaRange("23wh1a05c9", "23wh1a05j1"), ...generateRange("24wh5a0513", "24wh5a0519")],
  "3rd Year AIML A": generateRange("23wh1a6601", "23wh1a6664"),
  "3rd Year AIML B": [...generateRange("23wh1a6665", "23wh1a6699"), ...generateAlphaRange("23wh1a66a0", "23wh1a66c8")],
  "3rd Year ECE A": generateRange("23wh1a5501", "23wh1a5564"),
  "3rd Year ECE B": [...generateRange("23wh1a5565", "23wh1a5599"), ...generateAlphaRange("23wh1a55a0", "23wh1a55c8")],
  "3rd Year EEE": generateRange("23wh1a4401", "23wh1a4464"),

  // 4th Year (2022 batch)
  "4th Year CSE A": [...generateRange("22wh1a0501", "22wh1a0565"), ...generateRange("23wh5a0501", "23wh5a0506")],
  "4th Year CSE B": [...generateRange("22wh1a0566", "22wh1a0599"), ...generateAlphaRange("22wh1a05a0", "22wh1a05c9", [], ["76", "c5"]), ...generateRange("23wh5a0507", "23wh5a0512")],
  "4th Year CSE C": [...generateAlphaRange("22wh1a05d0", "22wh1a05j3"), "24wh8a0501", ...generateRange("23wh5a0513", "23wh5a0519")],
  "4th Year AIML A": generateRange("22wh1a6601", "22wh1a6664"),
  "4th Year AIML B": [...generateRange("22wh1a6665", "22wh1a6699"), ...generateAlphaRange("22wh1a66a0", "22wh1a66c8")],
  "4th Year ECE A": generateRange("22wh1a5501", "22wh1a5564"),
  "4th Year ECE B": [...generateRange("22wh1a5565", "22wh1a5599"), ...generateAlphaRange("22wh1a55a0", "22wh1a55c8")],
  "4th Year EEE": generateRange("22wh1a4401", "22wh1a4464")
};

function generateRange(start, end) {
  const rolls = [];
  const prefix = start.slice(0, -2);
  const startNum = parseInt(start.slice(-2));
  const endNum = parseInt(end.slice(-2));
  for (let i = startNum; i <= endNum; i++) {
    rolls.push(prefix + i.toString().padStart(2, '0'));
  }
  return rolls;
}

function generateAlphaRange(start, end, skip = [], exclude = []) {
  const rolls = [];
  const prefix = start.slice(0, -2);
  const startChar = start.slice(-2, -1);
  const startNum = parseInt(start.slice(-1));
  const endChar = end.slice(-2, -1);
  const endNum = parseInt(end.slice(-1));
  
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(c => !skip.includes(c));
  const startIdx = alphabet.indexOf(startChar);
  const endIdx = alphabet.indexOf(endChar);
  
  for (let i = startIdx; i <= endIdx; i++) {
    const letter = alphabet[i];
    const start = (i === startIdx) ? startNum : 0;
    const end = (i === endIdx) ? endNum : 9;
    for (let j = start; j <= end; j++) {
      const rollNum = prefix + letter + j;
      if (!exclude.includes(letter + j)) {
        rolls.push(rollNum);
      }
    }
  }
  return rolls;
}

function generateDoubleAlphaRange(start, end, skip = [], includeCi = false) {
  const rolls = [];
  const prefix = start.slice(0, -2);
  const startChars = start.slice(-2);
  const endChars = end.slice(-2);
  
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(c => !skip.includes(c));
  
  const startIdx1 = alphabet.indexOf(startChars[0]);
  const startIdx2 = alphabet.indexOf(startChars[1]);
  const endIdx1 = alphabet.indexOf(endChars[0]);
  const endIdx2 = alphabet.indexOf(endChars[1]);
  
  for (let i = startIdx1; i <= endIdx1; i++) {
    const letter1 = alphabet[i];
    const start2 = (i === startIdx1) ? startIdx2 : 0;
    const end2 = (i === endIdx1) ? endIdx2 : alphabet.length - 1;
    
    for (let j = start2; j <= end2; j++) {
      const letter2 = alphabet[j];
      const combo = letter1 + letter2;
      // Special case: include 'ci' for CSE F
      if (includeCi && combo === 'ci') {
        rolls.push(prefix + combo);
      } else if (combo !== 'ci') {
        rolls.push(prefix + combo);
      }
    }
  }
  return rolls;
}

// Get all roll numbers as flat array
function getAllRollNumbers() {
  return Object.values(ROLL_NUMBERS).flat();
}

// Get roll numbers by section
function getRollNumbersBySection(section) {
  return ROLL_NUMBERS[section] || [];
}

// Search for a roll number
function findStudentSection(rollNumber) {
  const roll = rollNumber.toLowerCase();
  for (const [section, rolls] of Object.entries(ROLL_NUMBERS)) {
    if (rolls.some(r => r.toLowerCase() === roll)) {
      return section;
    }
  }
  return null;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ROLL_NUMBERS, getAllRollNumbers, getRollNumbersBySection, findStudentSection };
}
