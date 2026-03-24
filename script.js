// -------------------------------
// Difficulty Settings
// -------------------------------
const DIFFICULTY_SETTINGS = {
  easy:    { goal: 15, spawnRate: 1200, time: 35 },
  normal:  { goal: 25, spawnRate: 1000, time: 30 },
  hard:    { goal: 35, spawnRate: 700,  time: 25 }
};

let selectedDifficulty = "normal";

// -------------------------------
// Game State Variables
// -------------------------------
let currentCans = 0;
let gameActive = false;
let spawnInterval;
let timerInterval;
let timeLeft = DIFFICULTY_SETTINGS[selectedDifficulty].time;

// -------------------------------
// Create the 3x3 Grid
// -------------------------------
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    grid.appendChild(cell);
  }
}

// Initialize grid on load
createGrid();

// -------------------------------
// Spawn a Water Can
// -------------------------------
function spawnWaterCan() {
  if (!gameActive) return;

  const cells = document.querySelectorAll('.grid-cell');
  cells.forEach(cell => (cell.innerHTML = ''));

  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;

  const can = randomCell.querySelector('.water-can');

  // Click to collect
  can.addEventListener('click', () => {
    if (!gameActive) return;

    currentCans++;
    document.getElementById('current-cans').textContent = currentCans;

    // Remove can immediately (DOM change requirement)
    can.parentElement.remove();

    // Achievement milestone feedback
    if (currentCans === Math.floor(DIFFICULTY_SETTINGS[selectedDifficulty].goal / 2)) {
      showAchievement("💧 Halfway there! Keep going!");
    }

    // Win condition
    if (currentCans >= DIFFICULTY_SETTINGS[selectedDifficulty].goal) {
      endGame(true);
    }
  });
}

// -------------------------------
// Start Game
// -------------------------------
function startGame() {
  if (gameActive) return;

  gameActive = true;
  currentCans = 0;

  const settings = DIFFICULTY_SETTINGS[selectedDifficulty];
  timeLeft = settings.time;

  document.getElementById('current-cans').textContent = currentCans;
  document.getElementById('timer').textContent = timeLeft;
  document.getElementById('achievements').textContent = '';

  createGrid();

  spawnInterval = setInterval(spawnWaterCan, settings.spawnRate);

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);
}

// -------------------------------
// End Game
// -------------------------------
function endGame(won) {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);

  const achievementBox = document.getElementById('achievements');

  if (won) {
    achievementBox.textContent = "🎉 You brought clean water to a community! Amazing work!";
  } else {
    achievementBox.textContent = "⏳ Time’s up! Try again to help more people get clean water.";
  }

  // Clear grid
  document.querySelectorAll('.grid-cell').forEach(cell => (cell.innerHTML = ''));
}

// -------------------------------
// Achievement Feedback
// -------------------------------
function showAchievement(message) {
  const box = document.getElementById('achievements');
  box.textContent = message;

  box.style.opacity = 1;
  setTimeout(() => (box.style.opacity = 0), 2000);
}

// -------------------------------
// Difficulty Selection
// -------------------------------
document.querySelectorAll('.difficulty-select button').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedDifficulty = btn.dataset.mode;

    // Highlight selected button
    document.querySelectorAll('.difficulty-select button')
      .forEach(b => b.classList.remove('active-mode'));

    btn.classList.add('active-mode');
  });
});

// -------------------------------
// Start Button
// -------------------------------
document.getElementById('start-game').addEventListener('click', startGame);

