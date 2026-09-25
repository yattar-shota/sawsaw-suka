const gameContainer = document.getElementById('game-container');
const finger = document.getElementById('finger');
const palm = document.getElementById('palm');
const dipBtn = document.getElementById('dip-btn');
const pullBtn = document.getElementById('pull-btn');
const chantText = document.getElementById('chant-text');

// Hard mode UI element
const hardModeBtn = document.getElementById('hard-mode-btn');
const leftPanel = document.getElementById('left-panel');
const rightPanel = document.getElementById('right-panel');
const streakCounter = document.getElementById('streak-counter');
const streakValue = document.getElementById('streak-value');
const leftRuleText = document.getElementById('left-rule-text');
const rightRuleText = document.getElementById('right-rule-text');

let gameState = 'idle'; // gameState: idle, dipping, pulling
const dipClasses = ['translate-y-[220px]'];

const words = ["Sawsaw", "suka,", "mahuli", "taya!"];
let wordIndex = 0;

let hasEscapedOnce = false;
let isHardMode = false;
let hardModeStreak = 0;
let hardModeTimer = null;

// add restrictions depending on the streak
function updateHardModeUI() {
  streakValue.textContent = hardModeStreak;

  let leftList = `<ul class="space-y-4 list-none">`;
  let rightList = `<ul class="space-y-4 list-none">`;

  // initial restrictins from streak 0
  leftList += `
    <li>
      <span class="font-bold text-red-700">掛け声なし</span><br>
    </li>`;
  rightList += `
    <li>
      <span class="font-bold text-red-700">ランダムなタイミングで閉じる</span><br>
    </li>`;

  // added restrictions from streak 3
  if (hardModeStreak >= 3) {
    leftList += `
      <li>
        <span class="font-bold text-red-700">ストリーク数に応じて待機時間の上限低下</span><br>
      </li>`;
  }

  leftList += `</ul>`;
  rightList += `</ul>`;

  leftRuleText.innerHTML = leftList;
  rightRuleText.innerHTML = rightList;
}

// Hard Mode Toggle Logic
hardModeBtn.addEventListener('click', () => {
  isHardMode = !isHardMode;
  
  if (isHardMode) {
    hardModeBtn.textContent = "🔥 Hard Mode: ON";
    hardModeBtn.classList.replace('bg-slate-800', 'bg-red-600');
    gameContainer.classList.replace('bg-white', 'bg-red-100');

    leftPanel.classList.remove('hidden');
    leftPanel.classList.add('flex');
    rightPanel.classList.remove('hidden');
    rightPanel.classList.add('flex');
    streakCounter.classList.remove('hidden');

    setTimeout(() => {
      leftPanel.classList.remove('opacity-0', '-translate-x-10');
      rightPanel.classList.remove('opacity-0', 'translate-x-10');
    }, 10);

    hardModeStreak = 0;
    updateHardModeUI();
    resetGame();
  } else {
    hardModeBtn.textContent = "🔥 Hard Mode";
    hardModeBtn.classList.replace('bg-red-600', 'bg-slate-800');
    gameContainer.classList.replace('bg-red-100', 'bg-white');

    leftPanel.classList.add('opacity-0', '-translate-x-10');
    rightPanel.classList.add('opacity-0', 'translate-x-10');
    streakCounter.classList.add('hidden');

    setTimeout(() => {
      leftPanel.classList.add('hidden');
      leftPanel.classList.remove('flex');
      rightPanel.classList.add('hidden');
      rightPanel.classList.remove('flex');
    }, 500);

    resetGame();
  }
});

// Dip Button Logic
dipBtn.addEventListener('click', () => {
  if (gameState === 'idle' || gameState === 'pulling') {
    // Add Tailwind translation classes to push the finger down
    finger.classList.add(...dipClasses);
    gameState = 'dipping';

    if (isHardMode) {
      chantText.textContent = "..."; // no chant
      palm.textContent = "🖐️"; 

      // more streaks means less time to react
      let maxDelay = Math.max(200, 1500 - (hardModeStreak * 10));
      let randomDelay = Math.random() * maxDelay + 200;

      hardModeTimer = setTimeout(() => {
        palm.textContent = "🤌";
        if (gameState === 'dipping') {
          chantText.textContent = "Caught!";
          finger.classList.remove(...dipClasses);
          hardModeStreak = 0;
          updateHardModeUI();
          gameState = 'idle';
        }
      }, randomDelay);
    } else {
      chant();
    }
  }
});

// Pull Button Logic
pullBtn.addEventListener('click', () => {
  // Remove Tailwind translation classes to snap the finger back up
  finger.classList.remove(...dipClasses);
  if (isHardMode) {
    if (gameState === 'dipping') {
      clearTimeout(hardModeTimer);
      gameState = 'pulling';
      palm.textContent = "🖐️";
      chantText.textContent = "Escaped!";
      hardModeStreak++;
      updateHardModeUI();
    }
  } else {
  gameState = 'pulling';
  }
});

// Catch Logic
function catchFinger() {
  palm.textContent = "✊";
  wordIndex = 0;
  
  if (gameState === 'dipping') {
    chantText.textContent = "You got caught!";
    // Reset finger position if caught
    finger.classList.remove(...dipClasses);
  } else {
    chantText.textContent = "You escaped!";
    if(!hasEscapedOnce){
      hasEscapedOnce = true;
      hardModeBtn.classList.remove('hidden');
    }
  }
}

// Word Addition Logic
function addWords() {
  chantText.textContent += words[wordIndex] + " ";
  wordIndex++;
}

// Chant Sequence Logic
function chant() {
  if (wordIndex === 0) {
    resetGame();
    addWords();
  } else if (wordIndex < words.length - 1) {
    addWords();
  } else {
    addWords();
    // Human reaction time limit is 200ms+, so delay ranges from 200ms to 1200ms
    let randomDelay = Math.random() * 1000 + 200; 
    setTimeout(catchFinger, randomDelay);
  }
}

// Reset Game State
function resetGame() {
  gameState = 'idle';
  palm.textContent = "🖐️";
  chantText.textContent = "";
}