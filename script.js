const audioFolder = 'audio/';
const notes = [
  'c3', 'cs3', 'd3', 'ds3', 'e3', 'f3', 'fs3', 'g3', 'gs3', 'a3', 'as3', 'b3',
  'c4', 'cs4', 'd4', 'ds4', 'e4', 'f4', 'fs4', 'g4', 'gs4', 'a4', 'as4', 'b4',
  'c5', 'cs5', 'd5', 'ds5', 'e5', 'f5', 'fs5', 'g5', 'gs5', 'a5', 'as5', 'b5',
  'c6'
];

// Correctly map file base name to answer button label
const noteMapping = {
  'c': 'C',
  'cs': 'C#/Db',
  'd': 'D',
  'ds': 'D#/Eb',
  'e': 'E',
  'f': 'F',
  'fs': 'F#/Gb',
  'g': 'G',
  'gs': 'G#/Ab',
  'a': 'A',
  'as': 'A#/Bb',
  'b': 'B'
};

const noteButtons = [
  'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'
];

let currentNote = '';
let currentAudio = null;
let correctCount = 0;
let incorrectCount = 0;

const startBtn = document.getElementById('startBtn');
const playNoteBtn = document.getElementById('playNoteBtn');
const playReferenceBtn = document.getElementById('playReferenceBtn');
const nextBtn = document.getElementById('nextBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');

const correctCountSpan = document.getElementById('correctCount');
const incorrectCountSpan = document.getElementById('incorrectCount');
const totalCountSpan = document.getElementById('totalCount');
const accuracySpan = document.getElementById('accuracy');

const noteButtonsDiv = document.getElementById('noteButtons');
const feedbackMessage = document.getElementById('feedbackMessage');
const questionPrompt = document.getElementById('questionPrompt');

// Initialize note buttons
noteButtons.forEach(label => {
  const button = document.createElement('button');
  button.textContent = label;
  button.disabled = true;
  button.addEventListener('click', () => checkAnswer(label, button));
  noteButtonsDiv.appendChild(button);
});

const noteButtonElements = noteButtonsDiv.querySelectorAll('button');

startBtn.addEventListener('click', startGame);
playNoteBtn.addEventListener('click', replayNote);
playReferenceBtn.addEventListener('click', playReferenceNote);
nextBtn.addEventListener('click', nextQuestion);
resetScoreBtn.addEventListener('click', resetScore);

function startGame() {
  startBtn.disabled = true;
  enableNoteButtons();
  nextBtn.disabled = true;
  pickRandomNote();
}

function enableNoteButtons() {
  noteButtonElements.forEach(button => button.disabled = false);
}

function disableNoteButtons() {
  noteButtonElements.forEach(button => button.disabled = true);
}

function pickRandomNote() {
  const randomIndex = Math.floor(Math.random() * notes.length);
  currentNote = notes[randomIndex];
  currentAudio = new Audio(audioFolder + currentNote + '.mp3');
  currentAudio.play();
  playNoteBtn.disabled = false;

  // Display the question prompt
  questionPrompt.textContent = 'What note was played?';
}

function replayNote() {
  if (currentAudio) {
    currentAudio.currentTime = 0;
    currentAudio.play();
  }
}

function playReferenceNote() {
  const referenceAudio = new Audio(audioFolder + 'c4.mp3');
  referenceAudio.play();
}

function checkAnswer(selectedNote, button) {
  const correctAnswer = simplifyNote(currentNote);

  if (selectedNote === correctAnswer) {
    correctCount++;
    feedbackMessage.textContent = 'Correct!';
    feedbackMessage.className = 'feedback correct'; // Apply correct class for styling
    button.classList.add('correct'); // Change button color to green
  } else {
    incorrectCount++;
    feedbackMessage.textContent = `Incorrect! The correct answer was ${correctAnswer}.`;
    feedbackMessage.className = 'feedback incorrect'; // Apply incorrect class for styling
    button.classList.add('incorrect'); // Change button color to red
  }

  updateScore();
  disableNoteButtons();
  nextBtn.disabled = false;
}

function simplifyNote(note) {
  // Handle sharps properly: if second char is 's' -> sharp
  let base = '';
  if (note[1] === 's') {
    base = note.slice(0, 2); // e.g., 'gs'
  } else {
    base = note.charAt(0); // e.g., 'g'
  }
  return noteMapping[base];
}

function updateScore() {
  const total = correctCount + incorrectCount;
  correctCountSpan.textContent = correctCount;
  incorrectCountSpan.textContent = incorrectCount;
  totalCountSpan.textContent = total;
  accuracySpan.textContent = total > 0 ? ((correctCount / total) * 100).toFixed(1) + '%' : '0%';
}

function nextQuestion() {
  pickRandomNote();
  enableNoteButtons();
  nextBtn.disabled = true;
  // Remove button color after moving to the next question
  noteButtonElements.forEach(button => button.classList.remove('correct', 'incorrect'));
  feedbackMessage.textContent = ''; // Clear feedback when moving to next question
  questionPrompt.textContent = ''; // Clear the question prompt
}

function resetScore() {
  correctCount = 0;
  incorrectCount = 0;
  updateScore();
  feedbackMessage.textContent = ''; // Clear the feedback when score is reset
  // Remove button
