const finger = document.getElementById('finger');
const palm = document.getElementById('palm');
const dipBtn = document.getElementById('dip-btn');
const pullBtn = document.getElementById('pull-btn');
const chantText = document.getElementById('chant-text');

let gameState = 'idle'; // gameState: idle, dipping, pulling

const dipClasses = ['translate-y-[220px]'];

/*
  Words for the chant
*/
const words = ["Sawsaw", "suka,", "mahuli", "taya!"];
let wordIndex = 0;

// Dip Button Logic
dipBtn.addEventListener('click', () => {
  if (gameState === 'idle' || gameState === 'pulling') {
    // Add Tailwind translation classes to push the finger down
    finger.classList.add(...dipClasses);
    gameState = 'dipping';
    chant();
  }
});

// Pull Button Logic
pullBtn.addEventListener('click', () => {
  // Remove Tailwind translation classes to snap the finger back up
  finger.classList.remove(...dipClasses);
  gameState = 'pulling';
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