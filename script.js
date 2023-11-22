var board = document.getElementById("boardContainerID");
var buttonContainer = document.getElementById("buttonContainerID");
var i, j, playerPosition;
var boardSize = 7;

// Create the board
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
    peg.textContent = "" + i + j;
    document.getElementById("" + i + j).appendChild(peg);
  }
}

// Function to return valid Moves
// Uses the current player position and returns a list of cells to which player can move
var GetValidMoves = (playerPosition) => {
  console.log("Checking Valid Moves for : ", playerPosition);
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
    if (InsideBoard(move)) {
      validMoves.push(move);
    }
  });

  console.log("Valid moves : ", validMoves);
  return validMoves;
};

// Function to perform Move
// Takes a cell to be moved to and moves the player
var MovePeg = (startPos, endPos) => {
  GetValidMoves(startPos).forEach((move) => {
    if (move[0] === endPos[0] && move[1] === endPos[1]) {
      console.log("Moving To : ", endPos);
      RemovePeg(endPos);
      RemovePeg(startPos);
      RemovePeg(FindBetweenPeg(startPos, endPos));
      var peg = document.createElement("span");
      peg.className = "peg";
      peg.textContent = "" + endPos[0] + endPos[1];
      document.getElementById("" + endPos[0] + endPos[1]).appendChild(peg);
    }
  });
};

// Util Function to "add" tuples
var Add = (a, b) => {
  return [a[0] + b[0], a[1] + b[1]];
};

// Util Function to check if position is inside board
var InsideBoard = (position) => {
  if (
    (position[0] < 3 && position[1] < 3) ||
    (position[0] < 3 && position[1] > 5) ||
    (position[0] > 5 && position[1] < 3) ||
    (position[0] > 5 && position[1] > 5)
  ) {
    return false;
  }
  return true;
};

// Util Function to check if peg exists on position
// var Exists = (position) => {
//   if (
//     position[0] < 0 ||
//     position[0] > 6 ||
//     position[1] < 0 ||
//     position[1] > 6
//   ) {
//     return false;
//   }
//   if (
//     document.getElementById("" + position[0] + position[1]).hasChildNodes() &&
//     window.getComputedStyle(
//       document.getElementById("" + position[0] + position[1]),
//       null
//     ).display === "flex"
//   ) {
//     return true;
//   }
//   return false;
// };

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

// Util Function to prepare controls
var SetupControls = () => {};
