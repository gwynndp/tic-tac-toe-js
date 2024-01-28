const playerX = { value: "X", score: 0, moves: [] };
const playerO = { value: "O", score: 0, moves: [] };
let cells;
let currentPlayer = playerX;
let winner = false;

const yourTurn = document.querySelector("#currentPlayer");
yourTurn.innerText = "Your Turn " + currentPlayer.value;

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
  if (winner) {
    console.error("Game Over! You can't make another moves");
  } else if (e.target.innerText === "") {
    e.target.innerText = currentPlayer.value;
    e.target.classList.add("play");
    currentPlayer.moves.push(Number(e.target.id));
    checkBoard();
  } else {
    console.error("Whoops! choose an empty square");
  }
}

// check if current player won
// if they did, update the player's score
// switch the current player for next turn
function checkBoard() {
  if (checkForWin()) {
    currentPlayer.score = currentPlayer.score + 1;
    console.table({
      currentPlayer: currentPlayer.score,
      playerX: playerX.score,
      playerO: playerO.score,
    });
    winner = currentPlayer;

    document.querySelector(
      `.player.${winner.value.toLowerCase()} .score`
    ).innerText = winner.score;

    const gameOver = document.querySelector(".game-over");
    gameOver.classList.remove("hidden");
    currentPlayer = currentPlayer === playerX ? playerO : playerX;
    yourTurn.innerText = "Your Turn " + currentPlayer.value;
  } else {
    currentPlayer = currentPlayer === playerX ? playerO : playerX;
    yourTurn.innerText = "Your Turn " + currentPlayer.value;
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
}

function clearScores() {
  playerX.score = 0;
  playerO.score = 0;
  const scores = document.querySelectorAll(".score");
  Array.from(scores).map((score) => (score.innerText = "0"));
  currentPlayer = playerX;
}

function main() {
  // add event listeners to each cell

  cells = document.querySelectorAll(".cell");
  Array.from(cells).map((cell) => {
    cell.addEventListener("click", playerMove);
  });

  const reset = document.querySelector("#reset");
  reset.addEventListener("click", () => {
    console.log("reset");
    // reset board and player scores
    clearBoard();
    clearScores();
  });

  const replay = document.querySelector("#replay");
  replay.addEventListener("click", () => {
    // reset board and hide overlay to replay
    const gameOver = document.querySelector(".game-over");
    gameOver.classList.add("hidden");
    clearBoard();
  });
}

document.addEventListener("DOMContentLoaded", function (event) {
  main();
});
