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
const error = document.querySelector(".error");
const board = document.querySelector(".board");

// initial state
const states = ["one", "two", "three", "four"];
const playerX = { value: "X", score: 0, moves: [] };
const playerO = { value: "O", score: 0, moves: [] };
let currentPlayer = playerX;
let winner = false;
yourTurn.innerText = "Your Turn " + currentPlayer.value;
let currentRotation = 0;
let hard = false;

// check for winner
function checkForWin() {
  // check rows = if 1,4,7 / 2,5,8 / 3,6,9
  // check cols = if 1,2,3 / 4,5,6 / 7,8,9
  // check diagonals = if 1,5,9 / 3,5,7
  // console.log("currentPlayer.moves", currentPlayer.moves);
  const moves = new Set(currentPlayer.moves);

  if (currentPlayer.moves.length < 3) return false;
  // check cols
  for (let i = 1; i <= 7; i = i + 3) {
    const result1 = moves.has(i + 0);
    const result2 = moves.has(i + 1);
    const result3 = moves.has(i + 2);
    // console.log("col", i + 0, i + 1, i + 2);
    if (result1 && result2 && result3) return true;
  }
  // check rows
  for (let i = 1; i <= 3; i++) {
    const result1 = moves.has(i + 0);
    const result2 = moves.has(i + 3);
    const result3 = moves.has(i + 6);
    // console.log("row", i + 0, i + 3, i + 6);
    if (result1 && result2 && result3) return true;
  }
  // check diags
  // for (let i = 1; i <= 3; i = i + 2) {
  const fwd1 = moves.has(1);
  const fwd2 = moves.has(5);
  const fwd3 = moves.has(9);
  if (fwd1 && fwd2 && fwd3) return true;

  const back1 = moves.has(3);
  const back2 = moves.has(5);
  const back3 = moves.has(7);
  if (back1 && back2 && back3) return true;
  // }
  return false;
}

// add a play & update board
// check for winner
// update current player for next turn
function playerMove(e) {
  e.preventDefault();
  const cell = e.target;
  error.classList.add("hide");

  // TODO: if no more moves
  if (winner) {
    console.error("Game Over! You can't make another move");
  } else if (cell.innerText === "") {
    cell.innerText = currentPlayer.value;
    cell.classList.add("play");
    currentPlayer.moves.push(Number(cell.id));
    checkBoard();
  } else {
    error.innerText = "Whoops! choose an empty square";
    error.classList.remove("hide");
  }
  // if in hard mode, rotate the board 90 deg every turn
  if (hard) {
    console.log(
      currentRotation,
      states[currentRotation],
      (currentRotation + 1) % 4
    );
    prev = currentRotation;
    currentRotation = (currentRotation + 1) % 4;
    board.classList.remove(states[prev]);
    board.classList.add(states[currentRotation]);
    Array.from(sets).map((set) => {
      set.classList.remove(states[prev]);
      set.classList.add(states[currentRotation]);
    });
  }
  // if in extra-hard mode
  // rotate the board 90 deg
  // & drop the values in stacks down the columns
  nextTurn();
}

// update current player for next turn
function nextTurn() {
  currentPlayer = currentPlayer === playerX ? playerO : playerX;
  yourTurn.innerText = "Your Turn " + currentPlayer.value;
}

// check if current player won
// if they did, update the player's score
function checkBoard() {
  if (checkForWin()) {
    gameOver.classList.remove("hidden");
    winner = currentPlayer;
    winner.score = winner.score + 1;
    const score = document.querySelector(
      `.player.${winner.value.toLowerCase()} .score`
    );
    score.innerText = winner.score;
  }
}

// clear value from cell
function clearBoard() {
  playerX.moves = [];
  playerO.moves = [];
  winner = false;
  board.classList.remove(states[currentRotation]);
  board.classList.add(states[0]);
  currentRotation = 0;
  Array.from(cells).map((cell) => {
    cell.innerText = "";
    cell.classList.remove("play");
  });
  error.classList.add("hide");
  gameOver.classList.add("hidden");
}

// clear player data
function clearScores() {
  playerX.score = 0;
  playerO.score = 0;
  Array.from(scores).map((score) => (score.innerText = "0"));
  currentPlayer = playerX;
}

function clearRotation() {
  Array.from(sets).map((set) => {
    set.classList.remove(...set.classList);
    set.classList.add("set");
    mode.checked = false;
    hard = false;
  });
}

function main() {
  error.classList.add("hide");

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
    clearRotation();
  });

  mode.addEventListener("change", (e) => {
    hard = e.target.checked;
  });

  info.addEventListener("mouseover", () => {
    document.querySelector("#info").classList.remove("hidden");
  });

  info.addEventListener("mouseout", () => {
    document.querySelector("#info").classList.add("hidden");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  main();
});
