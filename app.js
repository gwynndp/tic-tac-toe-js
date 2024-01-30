// page elements
const gameOver = document.querySelector(".game-over");
const yourTurn = document.querySelector("#currentPlayer");
const reset = document.querySelector("#reset");
const replay = document.querySelector("#replay");
const scores = document.querySelectorAll(".score");
const cells = document.querySelectorAll(".cell");
const sets = document.querySelectorAll(".set");
const info = document.querySelector("i");
const mode = document.querySelector("#mode");

// initial state
const playerX = { value: "X", score: 0, moves: [] };
const playerO = { value: "O", score: 0, moves: [] };
let currentPlayer = playerX;
let winner = false;
yourTurn.innerText = "Your Turn " + currentPlayer.value;
let currentRotation = 0;
let hard = false;

function checkForWin() {
  // check rows = if 1,4,7 / 2,5,8 / 3,6,9
  // check cols = if 1,2,3 / 4,5,6 / 7,8,9
  // check diagonals = if 1,5,9 / 3,5,7
  const vals = [];
  const moves = currentPlayer.moves;
  moves.sort();
  if (moves.length < 3) return false;
  // check cols
  for (let i = 1; i <= 9; i = i + 3) {
    const result1 = moves.includes(i + 0);
    const result2 = moves.includes(i + 1);
    const result3 = moves.includes(i + 2);
    if (result1 && result2 && result3) return true;
  }
  // check rows
  for (let i = 1; i <= 3; i++) {
    const result1 = moves.includes(i + 0);
    const result2 = moves.includes(i + 3);
    const result3 = moves.includes(i + 6);
    if (result1 && result2 && result3) return true;
  }
  // check diags
  for (let i = 1; i <= 3; i = i + 2) {
    const fwd1 = moves.includes(i + 0);
    const fwd2 = moves.includes(i + 4);
    const fwd3 = moves.includes(i + 8);
    if (fwd1 && fwd2 && fwd3) return true;

    const back1 = moves.includes(i + 0);
    const back2 = moves.includes(i + 2);
    const back3 = moves.includes(i + 4);
    if (back1 && back2 && back3) return true;
  }
  return false;
}

function playerMove(e) {
  e.preventDefault();
  const cell = e.target;
  error.classList.add("hidden");

  if (winner) {
    console.error("Game Over! You can't make another moves");
  } else if (cell.innerText === "") {
    cell.innerText = currentPlayer.value;
    cell.classList.add("play");
    currentPlayer.moves.push(Number(cell.id));
    checkBoard();
  } else {
    error.innerText = "Whoops! choose an empty square";
    error.classList.remove("hidden");
  }
  // if in hard mode
  // rotate the board 90 deg
  if (hard) {
    const states = ["_", "one", "two", "three"];
    const sets = document.querySelectorAll(".set");
    const board = document.querySelector(".board");
    console.log(states[currentRotation], board.classList);
    board.classList.remove(states[currentRotation]);
    board.classList.add(states[currentRotation + 1]);
    Array.from(sets).map((set) => {
      set.classList.remove(states[currentRotation]);
      set.classList.add(states[currentRotation + 1]);
    });
    currentRotation = (currentRotation + 1) % 4;
  }
  // if in extra-hard mode
  // rotate the board 90 deg
  // & drop the values in stacks down the columns
}

function nextTurn() {
  currentPlayer = currentPlayer === playerX ? playerO : playerX;
  yourTurn.innerText = "Your Turn " + currentPlayer.value;
}

// check if current player won
// if they did, update the player's score
// switch the current player for next turn
function checkBoard() {
  if (checkForWin()) {
    winner = currentPlayer;
    winner.score = winner.score + 1;

    const score = document.querySelector(
      `.player.${winner.value.toLowerCase()} .score`
    );
    score.innerText = winner.score;

    gameOver.classList.remove("hidden");
    nextTurn();
  } else {
    nextTurn();
  }
}

// clear player data
// clear value from cell
function clearBoard() {
  playerX.moves = [];
  playerO.moves = [];
  winner = false;
  Array.from(cells).map((cell) => {
    cell.innerText = "";
    cell.classList.remove("play");
  });
  error.classList.add("hidden");
}

function clearScores() {
  playerX.score = 0;
  playerO.score = 0;
  Array.from(scores).map((score) => (score.innerText = "0"));
  currentPlayer = playerX;
}

function clearRotation() {
  Array.from(sets).map((set) => {
    console.log(set.classList);
    set.classList.remove(...set.classList);
    set.classList.add("set");
    mode.checked = false;
    hard = false;
  });
}

function main() {
  // listen for player clicks
  Array.from(cells).map((cell) => {
    cell.addEventListener("click", playerMove);
  });

  // listen to reset board and player scores
  reset.addEventListener("click", () => {
    clearBoard();
    clearScores();
    clearRotation();
  });

  // listen to hide 'game over' and replay
  replay.addEventListener("click", () => {
    gameOver.classList.add("hidden");
    clearBoard();
  });

  mode.addEventListener("change", (e) => {
    console.log("checked", e.target.checked);
    hard = e.target.checked;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  main();
});
