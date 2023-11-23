var board = document.getElementById("boardContainerID");
var textContainer = document.getElementById("textContainerID");
var i, j, k, playerPosition;
var boardSize = 7;
var nMoves = 0;
var lifeTime = 1000;

var nExperiments = 1;
var avgMoves = 0;
var avgPegsRemaining = 0;

// Create the board
var InitializeBoard = () => {
  for (i = 0; i < boardSize; ++i) {
    var row = document.createElement("div");
    row.setAttribute("id", "rowID");
    row.className = "row";

    for (j = 0; j < boardSize; ++j) {
      var cell = document.createElement("div");
      cell.setAttribute("id", "" + i + j);
      cell.className = "cell";
      row.appendChild(cell);
    }

    board.appendChild(row);
  }

  // Prepare the board with pegs
  for (i = 0; i < boardSize; ++i) {
    for (j = 0; j < boardSize; ++j) {
      // Skip center of the board
      if (i == Math.floor(boardSize / 2) && j == Math.floor(boardSize / 2)) {
        continue;
      }

      var peg = document.createElement("span");
      peg.className = "peg";
      // peg.textContent = "" + i + j;
      document.getElementById("" + i + j).appendChild(peg);
    }
  }
};

// Function to return valid Moves
// Uses the current player position and returns a list of cells to which player can move
var GetValidMoves = (playerPosition) => {
  if (!InsideBoard(playerPosition)) return [];
  let moveUp = [-2, 0];
  let moveDown = [2, 0];
  let moveLeft = [0, -2];
  let moveRight = [0, 2];

  let playerUp = Add(playerPosition, moveUp);
  let playerDown = Add(playerPosition, moveDown);
  let playerLeft = Add(playerPosition, moveLeft);
  let playerRight = Add(playerPosition, moveRight);

  let validMoves = [];
  let tempMoves = [];
  tempMoves.push(playerUp, playerDown, playerLeft, playerRight);

  tempMoves.forEach((move) => {
    if (InsideBoard(move) && IsEmpty(move)) {
      validMoves.push(move);
    }
  });

  return validMoves;
};

// Function to perform Move
// Takes a cell to be moved to and moves the player
var MovePeg = (startPos, endPos) => {
  let movePerformed = false;
  GetValidMoves(startPos).forEach((move) => {
    if (move[0] === endPos[0] && move[1] === endPos[1]) {
      //   console.log("Moving ", startPos, " to ", endPos);
      RemovePeg(endPos);
      RemovePeg(startPos);
      RemovePeg(FindBetweenPeg(startPos, endPos));
      var peg = document.createElement("span");
      peg.className = "peg";
      //   peg.textContent = "" + endPos[0] + endPos[1];
      document.getElementById("" + endPos[0] + endPos[1]).appendChild(peg);
      movePerformed = true;
      nMoves++;
      UpdateStats();
    }
  });
  return movePerformed;
};

// Util Function to "add" tuples
var Add = (a, b) => {
  return [a[0] + b[0], a[1] + b[1]];
};

// Util Function to check if position is inside board
var InsideBoard = (position) => {
  if (
    position[0] < 0 ||
    position[0] > 6 ||
    position[1] < 0 ||
    position[1] > 6
  ) {
    return false;
  }
  if (
    (position[0] < 2 && position[1] < 2) ||
    (position[0] < 2 && position[1] > 4) ||
    (position[0] > 4 && position[1] < 2) ||
    (position[0] > 4 && position[1] > 4)
  ) {
    return false;
  }
  return true;
};

// Util Function to check if peg exists on position
var IsEmpty = (position) => {
  if (document.getElementById("" + position[0] + position[1]).hasChildNodes()) {
    return false;
  }
  return true;
};

// Util Function to remove peg
var RemovePeg = (position) => {
  let peg = document.getElementById("" + position[0] + position[1]);
  if (peg.firstChild) {
    peg.removeChild(peg.firstChild);
  }
};

// Util Function to find pegs between given two pegs while making a move
var FindBetweenPeg = (startingPos, EndPos) => {
  if (startingPos[0] === EndPos[0] && startingPos[1] < EndPos[1]) {
    return [startingPos[0], startingPos[1] + 1];
  } else if (startingPos[0] === EndPos[0] && startingPos[1] > EndPos[1]) {
    return [startingPos[0], startingPos[1] - 1];
  }
  if (startingPos[1] === EndPos[1] && startingPos[0] < EndPos[0]) {
    return [startingPos[0] + 1, startingPos[1]];
  } else if (startingPos[1] === EndPos[1] && startingPos[0] > EndPos[0]) {
    return [startingPos[0] - 1, startingPos[1]];
  }
};

// Util Function to find all pegs that can be moved
var MoveablePegs = () => {
  let moveablePegs = [];
  for (let i = 0; i < boardSize; ++i) {
    for (let j = 0; j < boardSize; ++j) {
      if (GetValidMoves([i, j]).length) {
        moveablePegs.push([i, j]);
      }
    }
  }
  return moveablePegs;
};

// Util Function to find all possible moves which remove a peg (Greedy)
var AllowedMoves = () => {
  let allowedMoves = [];
  MoveablePegs().forEach((startPos) => {
    GetValidMoves(startPos).forEach((endPos) => {
      if (!IsEmpty(FindBetweenPeg(startPos, endPos))) {
        allowedMoves.push([startPos, endPos]);
      }
    });
  });
  return allowedMoves;
};

// Util Function to perform Random Move
var RandomMove = () => {
  let allowedMoves = AllowedMoves();
  if (!allowedMoves.length) return;
  const randomElement =
    allowedMoves[Math.floor(Math.random() * allowedMoves.length)];
  MovePeg(randomElement[0], randomElement[1]);
};

// Util Functin to count empty Pegs
var EmptyPegs = () => {
  let count = 0;
  for (let i = 0; i < boardSize; ++i) {
    for (let j = 0; j < boardSize; ++j) {
      if (InsideBoard([i, j]) && IsEmpty([i, j])) {
        count++;
      }
    }
  }
  return count;
};

// Util Function to setup stats
var UpdateStats = () => {
  console.log("Update Stats");
  textContainer.textContent = `
  ${nMoves} move(s) done , Pegs Remaining :  ${33 - EmptyPegs()}
  `;
};

// Util Function to add report
var UpdateReport = () => {
  console.log("Update Report");
  textContainer.textContent = `
  Report
  Strategy : Greedy with Random Moves
  Number of Experiments : ${nExperiments}
  Average Moves per experiment : ${avgMoves / nExperiments}
  Average No of Pegs remaining : ${avgPegsRemaining / nExperiments}
  `;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Util Function to Reset Board
var ResetBoard = () => {
  nMoves = 0;
  board.replaceChildren();
  InitializeBoard();
};

// Game Lifecycle
var RunGame = async () => {
  for (k = 0; k <= lifeTime; k++) {
    if (!AllowedMoves().length) {
      break;
    }
    RandomMove();
    await sleep(100);
  }
};

// Run Experiment
var RunExperiment = async (days) => {
  nExperiments = days;
  ResetBoard();
  for (let k = 0; k < nExperiments; ++k) {
    ResetBoard();
    await RunGame();
    avgMoves += nMoves;
    avgPegsRemaining += 33 - EmptyPegs();
  }
  UpdateReport();
};

InitializeBoard();
